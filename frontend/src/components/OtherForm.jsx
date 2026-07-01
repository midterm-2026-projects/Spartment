export default function OtherForm() {
  return (
    <form>
      <h2>Spartment Assistant</h2>

      <label htmlFor="subject">Subject</label>
      <input id="subject" type="text" />

      <label htmlFor="message">Message</label>
      <textarea id="message"></textarea>

      <button type="button">Back</button>
      <button type="submit">Send</button>
    </form>
  );
}