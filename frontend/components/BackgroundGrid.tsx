export default function BackgroundGrid() {
  return (
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    />
  );
}
