import "./Loader.css";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="loader-wrap">
      <div className="loader-ring" />
      <p>{label}&hellip;</p>
    </div>
  );
}
