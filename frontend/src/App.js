import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import { MatchResultsTable } from "./MatchResults/MatchResultsTable";

function App() {
  const [data, setData] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        id: "rank",
        isIndex: true,
        Cell: ({ row }) => `#${row.index + 1}`,
      },
      {
        Header: "Team",
        accessor: "teamName",
      },
      // {
      //   Header: "Players",
      //   accessor: "teamMembers",
      //   // eslint-disable-next-line react/display-name
      //   Cell: (cellInfo) => (
      //     <table className="table--player">
      //       <thead>
      //         <tr>
      //           <th></th>
      //           <th>Kills</th>
      //           <th>Assists</th>
      //           <th>Damage</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {cellInfo.value
      //           .sort((a, b) => {
      //             const kills = b.kills - a.kills;
      //             const damage = b.damage - a.damage;
      //             return kills === 0 ? damage : kills;
      //           })
      //           .map((playerData) => (
      //             <tr key={playerData.name}>
      //               <td>{playerData.name}</td>
      //               <td>{playerData.kills} kills</td>
      //               <td>{playerData.assists} assists</td>
      //               <td>{playerData.damage} damage</td>
      //             </tr>
      //           ))}
      //       </tbody>
      //     </table>
      //   ),
      // },
      {
        Header: "Placement",
        accessor: "teamPlacement",
      },
      {
        Header: "Kills",
        accessor: "teamKills",
      },
      {
        Header: "Points",
        accessor: "teamPoints",
      },
    ],
    []
  );

  useEffect(() => {
    axios
      .get("http://localhost:3001/match/af378686-686ba89037a7c466793095")
      .then((value) =>
        setData(value.data.results.sort((a, b) => b.teamPoints - a.teamPoints))
      );
  });

  return (
    <div className="App">
      <MatchResultsTable columns={columns} data={data} />
    </div>
  );
}

export default App;
