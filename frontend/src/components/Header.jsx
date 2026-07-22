import UiIcon from "./UiIcon";

export default function Header() {
  return (
    <header className="brand" aria-label="Spartment home">
      <span className="brand__mark" aria-hidden="true">
        <UiIcon name="logo" size={29} />
      </span>
      <h1 className="brand__name">Spartment</h1>
    </header>
  );
}
