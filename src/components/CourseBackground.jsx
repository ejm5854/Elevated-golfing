/**
 * CourseBackground
 * Persistent full-screen SVG background that makes the app feel like
 * you're standing on the course — lush fairway green in the centre,
 * darker rough framing the edges, sand bunkers in the corners, a pond
 * on one side, mow stripes, and a distant flagstick.
 */
export default function CourseBackground() {
  return (
    <div className="course-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ── Rough texture gradient (dark edges) ── */}
          <radialGradient id="roughGrad" cx="50%" cy="55%" r="72%">
            <stop offset="0%"   stopColor="#1e5c32" />
            <stop offset="38%"  stopColor="#174d29" />
            <stop offset="65%"  stopColor="#0f3319" />
            <stop offset="85%"  stopColor="#0a2410" />
            <stop offset="100%" stopColor="#060f0a" />
          </radialGradient>

          {/* ── Fairway — central bright green ── */}
          <radialGradient id="fairwayGrad" cx="50%" cy="58%" r="55%">
            <stop offset="0%"   stopColor="#2d8c50" />
            <stop offset="40%"  stopColor="#267a43" />
            <stop offset="75%"  stopColor="#1e6636" />
            <stop offset="100%" stopColor="#174d29" stopOpacity="0" />
          </radialGradient>

          {/* ── Putting green — tight, bright ── */}
          <radialGradient id="greenGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#3dab65" />
            <stop offset="55%"  stopColor="#2e9456" />
            <stop offset="100%" stopColor="#237a43" />
          </radialGradient>

          {/* ── Water hazard ── */}
          <linearGradient id="pondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#0f2d4a" />
            <stop offset="50%"  stopColor="#163c5e" />
            <stop offset="100%" stopColor="#0a2035" />
          </linearGradient>

          {/* ── Sand bunker ── */}
          <radialGradient id="sandGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#e8d5a0" />
            <stop offset="70%"  stopColor="#d4bc82" />
            <stop offset="100%" stopColor="#b89a5a" />
          </radialGradient>

          {/* ── Mow stripe overlay ── */}
          <pattern id="mowStripes" x="0" y="0" width="60" height="900" patternUnits="userSpaceOnUse">
            <rect x="0"  y="0" width="30" height="900" fill="#ffffff" fillOpacity="0.04" />
            <rect x="30" y="0" width="30" height="900" fill="#000000" fillOpacity="0.03" />
          </pattern>

          {/* ── Water shimmer ── */}
          <pattern id="waterShimmer" x="0" y="0" width="80" height="20" patternUnits="userSpaceOnUse">
            <ellipse cx="40" cy="10" rx="35" ry="2" fill="#ffffff" fillOpacity="0.06" />
          </pattern>

          {/* ── Drop shadow for flag ── */}
          <filter id="flagShadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
          </filter>

          {/* ── Soft vignette mask ── */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>

          {/* ── Pond glare ── */}
          <radialGradient id="pondGlare" cx="35%" cy="30%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ════ LAYER 1 — Base rough ════ */}
        <rect width="1440" height="900" fill="url(#roughGrad)" />

        {/* ════ LAYER 2 — Fairway (dogleg left then bends right to green) ════ */}
        {/* Soft base glow under the whole fairway corridor */}
        <ellipse cx="680" cy="530" rx="700" ry="290" fill="url(#fairwayGrad)" fillOpacity="0.55" />

        {/* Main fairway shape — wide tee-side corridor sweeping left, then
            elbowing right through the dogleg toward the green upper-right */}
        <path
          d="M 60 780
             C 120 720, 200 660, 310 620
             C 420 580, 530 570, 610 548
             C 660 534, 680 510, 660 478
             C 638 444, 590 430, 560 408
             C 530 385, 530 355, 560 332
             C 600 302, 680 292, 780 300
             C 880 308, 980 320, 1060 338
             C 1140 356, 1200 378, 1230 400
             C 1260 422, 1270 448, 1250 468
             C 1220 496, 1150 500, 1090 490
             C 1040 482, 990 464, 960 448
             C 920 430, 900 420, 890 420
             C 878 420, 870 428, 872 440
             C 876 456, 896 468, 930 480
             C 970 494, 1020 506, 1060 512
             C 1100 518, 1160 516, 1200 498
             C 1240 480, 1270 450, 1280 418
             C 1295 378, 1280 340, 1240 316
             C 1180 282, 1080 268, 960 260
             C 840 252, 720 258, 630 272
             C 548 285, 490 308, 460 342
             C 428 378, 432 420, 460 454
             C 490 490, 540 510, 580 530
             C 618 548, 624 570, 600 600
             C 568 636, 490 662, 380 694
             C 270 726, 150 744, 60 780 Z"
          fill="#267a43"
          fillOpacity="0.82"
        />

        {/* Dogleg elbow highlight — the turn pocket, slightly brighter */}
        <path
          d="M 560 340 C 540 360, 528 390, 540 420 C 552 450, 580 468, 610 468
             C 640 468, 660 450, 656 424 C 652 396, 630 368, 600 352 C 580 340, 564 334, 560 340 Z"
          fill="#2e9456"
          fillOpacity="0.45"
        />

        {/* Second-shot corridor — after the turn, leading to the green */}
        <path
          d="M 870 430 C 920 420, 990 418, 1060 428 C 1110 436, 1150 448, 1160 460
             C 1170 472, 1150 488, 1100 494 C 1050 500, 990 494, 950 480
             C 910 466, 880 450, 870 430 Z"
          fill="#2d8c50"
          fillOpacity="0.55"
        />

        {/* Mow stripes clipped to the full fairway */}
        <clipPath id="fairwayClip">
          <path d="M 60 780
             C 120 720, 200 660, 310 620 C 420 580, 530 570, 610 548
             C 660 534, 680 510, 660 478 C 638 444, 590 430, 560 408
             C 530 385, 530 355, 560 332 C 600 302, 680 292, 780 300
             C 880 308, 980 320, 1060 338 C 1140 356, 1200 378, 1230 400
             C 1260 422, 1270 448, 1250 468 C 1220 496, 1150 500, 1090 490
             C 1040 482, 990 464, 960 448 C 920 430, 900 420, 890 420
             C 878 420, 870 428, 872 440 C 876 456, 896 468, 930 480
             C 970 494, 1020 506, 1060 512 C 1100 518, 1160 516, 1200 498
             C 1240 480, 1270 450, 1280 418 C 1295 378, 1280 340, 1240 316
             C 1180 282, 1080 268, 960 260 C 840 252, 720 258, 630 272
             C 548 285, 490 308, 460 342 C 428 378, 432 420, 460 454
             C 490 490, 540 510, 580 530 C 618 548, 624 570, 600 600
             C 568 636, 490 662, 380 694 C 270 726, 150 744, 60 780 Z" />
        </clipPath>
        <rect width="1440" height="900" fill="url(#mowStripes)" clipPath="url(#fairwayClip)" className="fairway-stripe" />

        {/* ════ LAYER 3 — Putting green ════ */}
        <ellipse cx="1080" cy="430" rx="148" ry="112" fill="#2e9456" fillOpacity="0.28" />
        <ellipse cx="1080" cy="430" rx="130"  ry="95"  fill="url(#greenGrad)" className="green-body" />
        <clipPath id="greenClip">
          <ellipse cx="1080" cy="430" rx="130" ry="95" />
        </clipPath>
        <rect width="1440" height="900" fill="url(#mowStripes)" clipPath="url(#greenClip)" fillOpacity="0.6" />

        {/* ════ LAYER 4 — Bunkers ════ */}

        {/* INSIDE THE DOGLEG ELBOW — classic "catch bunker" for players
            cutting the corner too tight. Sits right in the bend. */}
        <ellipse cx="612" cy="475" rx="55" ry="32" fill="#8a6820" fillOpacity="0.30" />
        <ellipse cx="608" cy="470" rx="58" ry="34" fill="url(#sandGrad)" fillOpacity="0.92" />
        <ellipse cx="606" cy="464" rx="44" ry="24" fill="#eddba8" fillOpacity="0.60" />

        {/* OUTSIDE THE ELBOW — punishes the safe bailout left */}
        <ellipse cx="490" cy="395" rx="70" ry="38" fill="#8a6820" fillOpacity="0.25" />
        <ellipse cx="486" cy="390" rx="74" ry="40" fill="url(#sandGrad)" fillOpacity="0.88" />
        <ellipse cx="483" cy="383" rx="56" ry="28" fill="#e8d5a0" fillOpacity="0.55" />

        {/* GREENSIDE BUNKER LEFT — protects left side of the green */}
        <ellipse cx="925" cy="496" rx="76" ry="40" fill="#a07c30" fillOpacity="0.20" />
        <ellipse cx="920" cy="490" rx="80" ry="42" fill="url(#sandGrad)" fillOpacity="0.90" />
        <ellipse cx="918" cy="484" rx="62" ry="30" fill="#e8d5a0" fillOpacity="0.55" />

        {/* GREENSIDE BUNKER RIGHT — deep pot bunker right of the pin */}
        <ellipse cx="1160" cy="486" rx="52" ry="30" fill="#8a6820" fillOpacity="0.28" />
        <ellipse cx="1156" cy="481" rx="55" ry="32" fill="url(#sandGrad)" fillOpacity="0.88" />
        <ellipse cx="1154" cy="475" rx="40" ry="22" fill="#eddba8" fillOpacity="0.62" />

        {/* FAIRWAY BUNKER — mid-fairway on the second shot landing zone */}
        <ellipse cx="820" cy="340" rx="62" ry="30" fill="#8a6820" fillOpacity="0.22" />
        <ellipse cx="816" cy="335" rx="65" ry="32" fill="url(#sandGrad)" fillOpacity="0.85" />
        <ellipse cx="814" cy="329" rx="48" ry="22" fill="#e0c990" fillOpacity="0.50" />

        {/* TEE-SIDE BUNKER — bottom-left, frames the tee box */}
        <ellipse cx="218" cy="768" rx="140" ry="72" fill="#a07c30" fillOpacity="0.25" />
        <ellipse cx="210" cy="760" rx="145" ry="75" fill="url(#sandGrad)" fillOpacity="0.88" />
        <ellipse cx="210" cy="752" rx="120" ry="58" fill="#e0c990" fillOpacity="0.5" />

        {/* BACK CORNER BUNKER — top-right, behind the green */}
        <ellipse cx="1318" cy="162" rx="170" ry="86" fill="#a07c30" fillOpacity="0.22" />
        <ellipse cx="1310" cy="155" rx="175" ry="90" fill="url(#sandGrad)" fillOpacity="0.85" />
        <ellipse cx="1300" cy="148" rx="140" ry="68" fill="#e0c990" fillOpacity="0.45" />

        {/* ════ LAYER 5 — Water hazard ════ */}
        <path
          d="M 320 140 C 380 100,500 95,560 130 C 610 158,615 205,575 230
             C 530 260,440 265,370 245 C 295 223,265 185,320 140 Z"
          fill="url(#pondGrad)"
        />
        <path
          d="M 320 140 C 380 100,500 95,560 130 C 610 158,615 205,575 230
             C 530 260,440 265,370 245 C 295 223,265 185,320 140 Z"
          fill="url(#pondGlare)"
        />
        <path
          d="M 320 140 C 380 100,500 95,560 130 C 610 158,615 205,575 230
             C 530 260,440 265,370 245 C 295 223,265 185,320 140 Z"
          fill="url(#waterShimmer)"
          fillOpacity="0.7"
        />
        <path
          d="M 320 140 C 380 100,500 95,560 130 C 610 158,615 205,575 230
             C 530 260,440 265,370 245 C 295 223,265 185,320 140 Z"
          fill="none" stroke="#1a6640" strokeWidth="3" strokeOpacity="0.4"
        />
        {/* Yellow hazard stake */}
        <line x1="560" y1="230" x2="560" y2="195" stroke="#e8c020" strokeWidth="2.5" strokeOpacity="0.8" />
        <circle cx="560" cy="193" r="4" fill="#e8c020" fillOpacity="0.9" />

        {/* ════ LAYER 6 — Flagstick ════ */}
        <ellipse cx="1092" cy="356" rx="8" ry="3" fill="#000" fillOpacity="0.25" />
        <line x1="1085" y1="356" x2="1085" y2="298" stroke="#e8e8d8" strokeWidth="2.5" filter="url(#flagShadow)" />
        <path d="M 1085 298 L 1118 307 L 1085 316 Z" fill="#cc2222" filter="url(#flagShadow)" />
        <path d="M 1085 298 L 1118 307 L 1085 316 Z" fill="#ffffff" fillOpacity="0.12" />
        <circle cx="1085" cy="357" r="5" fill="#111" fillOpacity="0.7" />
        <circle cx="1085" cy="357" r="5" fill="none" stroke="#888" strokeWidth="1" />

        {/* ════ LAYER 7 — Cart path ════ */}
        <path
          d="M 0 680 C 200 670,350 640,500 620 C 650 600,820 570,1000 540 C 1150 515,1300 490,1440 460"
          fill="none" stroke="#b5a878" strokeWidth="14" strokeOpacity="0.28" strokeLinecap="round"
        />
        <path
          d="M 0 680 C 200 670,350 640,500 620 C 650 600,820 570,1000 540 C 1150 515,1300 490,1440 460"
          fill="none" stroke="#d4c89a" strokeWidth="2" strokeOpacity="0.18"
          strokeDasharray="24 18" strokeLinecap="round"
        />

        {/* ════ LAYER 8 — Rough masses at edges ════ */}
        <path
          d="M 0 0 L 380 0 C 320 40,260 90,200 150 C 130 220,70 300,40 400 C 15 480,0 560,0 640 Z"
          fill="#0a2410" fillOpacity="0.55"
        />
        <path
          d="M 1440 900 L 1060 900 C 1130 840,1200 780,1260 700 C 1330 610,1400 500,1430 380 C 1440 300,1440 200,1440 100 Z"
          fill="#0a2410" fillOpacity="0.5"
        />
        <path
          d="M 400 900 C 500 860,620 840,720 845 C 820 850,940 865,1040 900 Z"
          fill="#0f2e18" fillOpacity="0.65"
        />

        {/* ════ LAYER 9 — Vignette ════ */}
        <rect width="1440" height="900" fill="url(#vignette)" />

        {/* ════ LAYER 10 — Readability overlay ════ */}
        <rect width="1440" height="900" fill="#060f0a" fillOpacity="0.28" />
      </svg>
    </div>
  )
}