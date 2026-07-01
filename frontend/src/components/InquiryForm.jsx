export default function InquiryForm() {
  return (
    <form>
      <h2>Spartment Assistant</h2>

      <label htmlFor="fullname">Full Name</label>
      <input id="fullname" type="text" />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" />

      <label htmlFor="contact">Contact</label>
      <input id="contact" type="text" />

      <label htmlFor="room">Preferred Room</label>
      <input
        id="room"
        type="text"
        placeholder="e.g. 102"
      />

      <label htmlFor="movein">Move-in Date</label>
      <input id="movein" type="date" />

      <label htmlFor="message">Message</label>
      <textarea id="message"></textarea>

      <button type="submit">Send</button>
    </form>
  );
}