"use client";

export type MascotState =
  | "idle"
  | "listening"
  | "thinking"
  | "writing"
  | "surprised"
  | "skeptical"
  | "annoyed"
  | "pout"
  | "blush"
  | "finished"
  | "analyzing";

const MASCOT_IMAGES: Record<MascotState, string | null> = {
  idle: null,
  listening: null,
  thinking: null,
  writing: null,
  surprised: null,
  skeptical: null,
  annoyed: null,
  pout: null,
  blush: null,
  finished: null,
  analyzing: null,
};

type MascotSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<MascotSize, string> = {
  xs: "h-20 w-20",
  sm: "h-28 w-28",
  md: "h-40 w-40",
  lg: "h-56 w-56",
  xl: "h-[400px] w-[320px]",
};

export function Mascot({
  state = "idle",
  size = "md",
  className = "",
}: {
  state?: MascotState;
  size?: MascotSize;
  className?: string;
}) {
  const src = MASCOT_IMAGES[state];

  return (
    <div
      className={`mascot mascot-${state} ${SIZE_CLASSES[size]} ${className} relative`}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={state}
          src={src}
          alt=""
          draggable={false}
          className="mascot-enter h-full w-full select-none object-contain"
        />
      ) : (
        <MascotPlaceholder key={state} state={state} />
      )}
    </div>
  );
}

function MascotPlaceholder({ state }: { state: MascotState }) {
  const bodyDark = "#2a2f7a";
  const bodyMid = "#5c6bff";
  const headLight = "#93a2ff";
  const cheek = "#ff7a9c";

  return (
    <svg
      viewBox="0 0 200 260"
      className="mascot-enter h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="mascotHead" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={headLight} />
          <stop offset="55%" stopColor={bodyMid} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
        <linearGradient id="mascotBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bodyMid} />
          <stop offset="100%" stopColor={bodyDark} />
        </linearGradient>
        <radialGradient id="mascotAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={bodyMid} stopOpacity="0.4" />
          <stop offset="100%" stopColor={bodyMid} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="140" rx="90" ry="110" fill="url(#mascotAura)" />
      <ellipse cx="100" cy="248" rx="55" ry="6" fill="rgba(0,0,0,0.5)" />

      <path
        d="M100 155 C 60 155, 45 185, 50 225 C 52 240, 60 248, 75 248 L 125 248 C 140 248, 148 240, 150 225 C 155 185, 140 155, 100 155 Z"
        fill="url(#mascotBody)"
      />

      <ellipse cx="48" cy="205" rx="12" ry="18" fill={bodyMid} />
      <ellipse cx="152" cy="205" rx="12" ry="18" fill={bodyMid} />
      <ellipse cx="78" cy="246" rx="14" ry="6" fill={bodyDark} />
      <ellipse cx="122" cy="246" rx="14" ry="6" fill={bodyDark} />

      <circle cx="100" cy="92" r="68" fill="url(#mascotHead)" />

      <ellipse cx="78" cy="60" rx="20" ry="12" fill="white" opacity="0.35" transform="rotate(-25 78 60)" />
      <ellipse cx="52" cy="110" rx="10" ry="6" fill={cheek} opacity="0.85" />
      <ellipse cx="148" cy="110" rx="10" ry="6" fill={cheek} opacity="0.85" />

      <Face state={state} />
      <StateExtras state={state} />
    </svg>
  );
}

function Face({ state }: { state: MascotState }) {
  const dark = "#0a0a12";

  /* Глаза по умолчанию */
  let eyes: React.ReactNode = (
    <>
      <ellipse cx="80" cy="92" rx="9" ry="13" fill="white" />
      <ellipse cx="120" cy="92" rx="9" ry="13" fill="white" />
      <ellipse cx="80" cy="94" rx="6" ry="9" fill={dark} />
      <ellipse cx="120" cy="94" rx="6" ry="9" fill={dark} />
      <circle cx="82" cy="90" r="2.5" fill="white" />
      <circle cx="122" cy="90" r="2.5" fill="white" />
    </>
  );

  if (state === "listening" || state === "surprised") {
    eyes = (
      <>
        <ellipse cx="80" cy="92" rx="12" ry="16" fill="white" />
        <ellipse cx="120" cy="92" rx="12" ry="16" fill="white" />
        <ellipse cx="80" cy="94" rx="7" ry="11" fill={dark} />
        <ellipse cx="120" cy="94" rx="7" ry="11" fill={dark} />
        <circle cx="82" cy="89" r="3" fill="white" />
        <circle cx="122" cy="89" r="3" fill="white" />
      </>
    );
  }

  if (state === "thinking") {
    eyes = (
      <>
        <ellipse cx="80" cy="92" rx="8" ry="10" fill="white" />
        <ellipse cx="120" cy="92" rx="8" ry="10" fill="white" />
        <ellipse cx="80" cy="93" rx="5" ry="7" fill={dark} />
        <ellipse cx="120" cy="93" rx="5" ry="7" fill={dark} />
        <circle cx="82" cy="90" r="2" fill="white" />
        <circle cx="122" cy="90" r="2" fill="white" />
      </>
    );
  }

  if (state === "writing") {
    eyes = (
      <>
        <path d="M72 92 Q80 87 88 92" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M112 92 Q120 87 128 92" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  }

  /* Цундере: смотрит искоса, брови нахмурены */
  if (state === "skeptical") {
    eyes = (
      <>
        <ellipse cx="80" cy="92" rx="8" ry="11" fill="white" />
        <ellipse cx="120" cy="92" rx="8" ry="11" fill="white" />
        <ellipse cx="82" cy="94" rx="5" ry="8" fill={dark} />
        <ellipse cx="122" cy="94" rx="5" ry="8" fill={dark} />
        <circle cx="83" cy="90" r="2" fill="white" />
        <circle cx="123" cy="90" r="2" fill="white" />
        <path d="M70 80 L86 84" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M130 80 L114 84" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }

  /* Злится: прищуренные глаза + нахмуренные брови */
  if (state === "annoyed") {
    eyes = (
      <>
        <path d="M70 94 L88 92" stroke={dark} strokeWidth="3" strokeLinecap="round" />
        <path d="M130 94 L112 92" stroke={dark} strokeWidth="3" strokeLinecap="round" />
        <path d="M68 82 L86 86" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M132 82 L114 86" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }

  /* Отворачивается: полузакрытые глаза */
  if (state === "pout") {
    eyes = (
      <>
        <path d="M72 92 Q80 87 88 92" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M112 92 Q120 87 128 92" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M70 84 L88 86" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }

  /* Смущение: закрытые глаза-щёлочки */
  if (state === "blush") {
    eyes = (
      <>
        <path d="M72 90 Q80 80 88 90" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M112 90 Q120 80 128 90" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  }

  if (state === "finished" || state === "analyzing") {
    eyes = (
      <>
        <path d="M72 96 Q80 84 88 96" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M112 96 Q120 84 128 96" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>
    );
  }

  /* Рот */
  let mouth: React.ReactNode = (
    <path d="M92 122 Q100 128 108 122" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
  );

  if (state === "listening") mouth = <ellipse cx="100" cy="124" rx="4" ry="5" fill={dark} />;
  if (state === "thinking" || state === "analyzing")
    mouth = <path d="M94 124 L106 124" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />;
  if (state === "writing")
    mouth = <path d="M94 124 Q100 127 106 124" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />;
  if (state === "surprised") mouth = <circle cx="100" cy="125" r="7" fill={dark} />;
  if (state === "skeptical")
    mouth = <path d="M90 126 Q100 122 110 128" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  if (state === "annoyed")
    mouth = <path d="M92 128 Q100 120 108 128" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  if (state === "pout")
    mouth = <path d="M94 124 Q100 121 106 124" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  if (state === "blush")
    mouth = <path d="M94 122 Q100 130 106 122" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  if (state === "finished")
    mouth = <path d="M90 120 Q100 134 110 120" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />;

  return (
    <g>
      {eyes}
      {mouth}
    </g>
  );
}

function StateExtras({ state }: { state: MascotState }) {
  if (state === "thinking" || state === "analyzing") {
    return (
      <g>
        <circle cx="150" cy="50" r="4" fill="#93a2ff" opacity="0.5" />
        <circle cx="162" cy="38" r="5" fill="#93a2ff" opacity="0.7" />
        <circle cx="176" cy="24" r="6" fill="#ff3b00" opacity="0.95" />
      </g>
    );
  }

  if (state === "surprised") {
    return (
      <g>
        <path d="M30 60 L22 52 M170 60 L178 52 M100 10 L100 2" stroke="#ff3b00" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }

  if (state === "writing") {
    return (
      <g>
        <rect x="145" y="180" width="36" height="46" rx="4" fill="#2a2a3a" stroke="#93a2ff" strokeWidth="1.5" />
        <path
          d="M152 192 L174 192 M152 200 L174 200 M152 208 L166 208"
          stroke="#93a2ff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    );
  }

  /* Раздражение / обида — венка */
  if (state === "annoyed" || state === "pout" || state === "skeptical") {
    return (
      <g>
        <path d="M148 38 L156 32 M160 38 L168 32" stroke="#ff3b00" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M152 48 L166 48 M159 44 L159 52" stroke="#ff3b00" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
  }

  /* Смущение — усиленный румянец */
  if (state === "blush") {
    return (
      <g>
        <ellipse cx="52" cy="110" rx="13" ry="8" fill="#ff5a7a" opacity="0.9" />
        <ellipse cx="148" cy="110" rx="13" ry="8" fill="#ff5a7a" opacity="0.9" />
      </g>
    );
  }

  if (state === "finished") {
    return (
      <g>
        <path d="M40 40 L34 30 M160 40 L166 30 M100 20 L100 8" stroke="#ff3b00" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }

  return null;
}