// Placeholder InteractiveLogo component.
// Replace this file with your real 3D logo from the Figma export
// (likely a Three.js / react-three-fiber component).

export function InteractiveLogo() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div
          className="w-64 h-64 rounded-full bg-gradient-to-br from-[#688952] to-[#D8CDB1] shadow-2xl animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-2xl tracking-widest text-center px-4">
            GREEN
            <br />
            SUMMER
            <br />
            COLLECTIVE
          </div>
        </div>
      </div>
    </div>
  );
}
