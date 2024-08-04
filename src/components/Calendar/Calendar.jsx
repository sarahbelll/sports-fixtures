import React, { useEffect, useState } from "react";
import "./Calendar.css";

const Calendar = () => {
  const [formattedDates, setFormattedDates] = useState([]);
  const [matchDetails, setMatchDetails] = useState([]);

  // Generate an array of all dates for the entire year
  const generateDatesForYear = (year) => {
    const dates = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    return dates;
  };

  useEffect(() => {
    const year = new Date().getFullYear();

    // Generate dates
    const dates = generateDatesForYear(year);
    const formattedDates = dates.map((date) => ({
      fullDate: date.toLocaleDateString("en-GB", { day: 'numeric', month: 'numeric', year: 'numeric' }),
      day: date.getDate(),
      weekday: new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date),
    }));
    setFormattedDates(formattedDates);

    // Fetch matches
    const fetchMatches = async () => {
      const url = `/api/v4/competitions/PL/matches?status=SCHEDULED&dateFrom=2024-08-15&dateTo=2025-05-26`;
      const apiKey = "7663797620024e02a3a97b6d2159bd52";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Auth-Token": apiKey,
        },
      });
      const data = await response.json();
      console.log(data)

      const formattedMatches = data.matches.map((match) => {
        const date = new Date(match.utcDate);
        const fullDate = date.toLocaleDateString("en-GB", { day: 'numeric', month: 'numeric', year: 'numeric' });

        return {
          homeTeam: match.homeTeam.tla,
          homeTeamCrest: match.homeTeam.crest,
          awayTeam: match.awayTeam.tla,
          awayTeamCrest: match.awayTeam.crest,
          fullDate
        };
      });

      setMatchDetails(formattedMatches);
    };

    fetchMatches();
  }, []);

  // Group matches by date
  const matchesByDate = matchDetails.reduce((acc, match) => {
    if (!acc[match.fullDate]) {
      acc[match.fullDate] = [];
    }
    acc[match.fullDate].push(match);
    return acc;
  }, {});

  return (
    <div className="calendar-container">
      <h1>{new Date().getFullYear()} Calendar</h1>
      <table>
        <thead>
          <tr>
            {formattedDates.map((item, index) => (
              <th key={index}>
                <div className="header-cell">
                  <div className="weekday">{item.weekday}</div>
                  <div className="day">{item.day}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {formattedDates.map((item, index) => (
              <td key={index}>
                {matchesByDate[item.fullDate] ? (
                  matchesByDate[item.fullDate].map((match, idx) => (
                    <div key={idx} className="match">
                      {<img src={match.homeTeamCrest} alt="team crest"/>}{match.homeTeam} vs {match.awayTeam}{<img src={match.awayTeamCrest} alt="team crest"/>}
                    </div>
                  ))
                ) : (
                  <div></div>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
