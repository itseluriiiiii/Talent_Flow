export default function GradientBackgroundTailwind() {
  return (
    <div
      className="fixed inset-0 -z-10 animate-gradient-shift"
      style={{
        background: 'linear-gradient(135deg, #fbfbfb 0%, #cdc1ff 50%, #a294f9 100%)',
        backgroundSize: '400% 400%',
      }}
    />
  );
}
