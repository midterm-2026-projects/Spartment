export default function UtilityStatementTable({ utilityStatements }) {
  if (utilityStatements.length === 0) {
    return <p>No utility statements found.</p>;
  }

  return (
    <div>
      <h2>Utility Statements</h2>

      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Due Date</th>
            <th>Electricity</th>
            <th>Water</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {utilityStatements.map((statement, index) => (
            <tr key={index}>
              <td>{statement.period}</td>

              <td>{statement.dueDate}</td>

              <td>₱{statement.electricity}</td>

              <td>₱{statement.water}</td>

              <td>₱{statement.total}</td>

              <td>{statement.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
