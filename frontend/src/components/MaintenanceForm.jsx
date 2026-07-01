export default function MaintenanceForm() {
  return (
    <form>
      <h2>Spartment Assistant</h2>

      <label htmlFor="roomNumber">Room Number</label>
      <input id="roomNumber" type="text" />

      <label htmlFor="issue">Issue</label>
      <input
        id="issue"
        type="text"
        placeholder="e.g. Leaking faucet"
      />

      <label htmlFor="description">Description</label>
      <textarea id="description"></textarea>

      <button type="button">Back</button>
      <button type="submit">Send</button>
    </form>
  );
}