import DoveIcon from './DoveIcon';

/** Two small abstract doves drifting across the upper third of the hero — barely visible, atmospheric. */
export default function DecorativeDoves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <DoveIcon className="absolute top-[18%] left-[8%] w-12 h-8 text-white animate-dove-float" />
      <DoveIcon
        className="absolute top-[28%] left-[8%] w-9 h-6 text-white animate-dove-float"
        style={{ animationDelay: '9s' }}
      />
    </div>
  );
}
