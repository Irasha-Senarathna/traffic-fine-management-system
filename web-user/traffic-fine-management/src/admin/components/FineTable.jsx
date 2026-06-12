export default function FineTable({ fines }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Vehicle</th>
          <th>NIC</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {fines.map((fine) => (
          <tr key={fine.id}>
            <td>{fine.id}</td>
            <td>{fine.vehicle}</td>
            <td>{fine.nic}</td>
            <td>{fine.amount}</td>
            <td>{fine.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}