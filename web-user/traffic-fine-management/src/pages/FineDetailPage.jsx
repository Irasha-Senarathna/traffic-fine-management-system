import React, { useState, useRef, useEffect } from "react";

const sampleFines = [
  {
    id: 1, type: "Speeding", icon: "🚗", amount: "LKR 5,000",
    short: "Driving above the speed limit",
    desc: "You were recorded driving at 80 km/h in a 60 km/h zone. This violation is classified as a speeding offense. Typical penalties include a monetary fine and license points. Repeated offenses may result in higher fines, license suspension, or mandatory driving courses. Recommended actions: review the attached evidence, pay the fine online to avoid late fees, or file a contest within the allowed timeframe if you believe this is incorrect.",
  },
  {
    id: 2, type: "Illegal Parking", icon: "🅿️", amount: "LKR 3,000",
    short: "Parking in a no-parking zone",
    desc: "Vehicle parked in a restricted area (e.g., near a fire hydrant, bus stop, or disabled bay). This causes obstruction and safety hazards. Penalties usually include a fine and may include towing charges if the vehicle was removed. Recommended actions: check for photos and location details, pay the fine to avoid additional fees, or request review if signage was unclear.",
  },
  {
    id: 3, type: "Signal Violation", icon: "🚦", amount: "LKR 4,000",
    short: "Running a red light or disobeying traffic signals",
    desc: "Failure to obey traffic signals (running red lights, ignoring stop signs). This is a serious safety risk and can lead to collisions. Penalties commonly include fines, license points, and in some jurisdictions mandatory court appearance for severe cases. Recommended actions: review incident time and camera evidence, pay the fine if valid, and attend any required hearings.",
  },
  {
    id: 4, type: "Overtaking (Unsafe)", icon: "↗️", amount: "LKR 7,500",
    short: "Dangerous or prohibited overtaking maneuver",
    desc: "Overtaking in a no-overtake zone or performing a risky pass that endangers other road users. This often carries heavier penalties due to high collision risk. Typical consequences include fines, license points, and possible suspension for repeated offenders. Recommended actions: review dashcam or camera evidence, and pay or contest with evidence.",
  },
  {
    id: 5, type: "Cutting Road Lines / Lane Markings", icon: "🚧", amount: "LKR 6,000",
    short: "Crossing or ignoring lane/divider markings",
    desc: "Crossing solid lines, cutting across lane dividers, or otherwise ignoring road markings that guide safe vehicle flow. Such behavior disrupts traffic and increases crash risk. Penalties often include fines and warnings; repeat cases may escalate. Recommended actions: inspect location images and pay or request review.",
  },
  {
    id: 6, type: "Illegal U-turn", icon: "🔄", amount: "LKR 4,500",
    short: "Performing a U-turn where prohibited",
    desc: "Making a U-turn at locations where it is forbidden or unsafe. This can cause sudden conflicts with oncoming traffic. Penalties generally include fines and sometimes points. Check signage and evidence before responding.",
  },
  {
    id: 7, type: "Reckless Driving", icon: "⚠️", amount: "LKR 15,000",
    short: "Driving that shows disregard for safety",
    desc: "Speeding combined with risky maneuvers, tailgating, or weaving at high speed qualifies as reckless driving. This is treated severely and may lead to large fines, license suspension, or court summons. Review incident details carefully and consult legal advice if necessary.",
  },
  {
    id: 8, type: "No Helmet (Motorcycle)", icon: "🪖", amount: "LKR 2,500",
    short: "Riding without a helmet",
    desc: "Motorcycle riders and passengers must wear approved helmets. Violations endanger riders and typically result in fines and possible vehicle impoundment for repeat offenses. Evidence usually includes photos from roadside cameras.",
  },
  {
    id: 9, type: "Seatbelt Violation", icon: "🔒", amount: "LKR 2,000",
    short: "Driver or passenger without seatbelt",
    desc: "Failure to wear a seatbelt increases injury risk in collisions. Enforcement commonly issues small fines and reminders. If you believe the fine is incorrect, review vehicle camera or enforcement logs.",
  },
  {
    id: 10, type: "Blocking Intersection", icon: "🚫", amount: "LKR 5,500",
    short: "Stopping in the intersection and obstructing flow",
    desc: "Blocking an intersection causes congestion and safety hazards. Penalties include fines and may carry higher charges during peak traffic or emergency routes. Check the incident time and related evidence.",
  },
];

function parseAmount(a) {
  if (a == null) return 0;
  const num = Number(String(a).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
}

function severityFor(amount) {
  const a = parseAmount(amount);
  if (a > 10000) return "High";
  if (a > 4000)  return "Medium";
  return "Low";
}

const SEVERITY_COLOR = {
  High:   "var(--danger)",
  Medium: "var(--warning)",
  Low:    "var(--success)",
};

function severityWeight(s) {
  if (s === "High")   return 3;
  if (s === "Medium") return 2;
  return 1;
}

export default function FineDetailPage() {
  const [openId, setOpenId] = useState(null);
  const refs = useRef({});

  useEffect(() => {
    Object.values(refs.current).forEach((el) => {
      if (el) el.style.transition = "max-height 280ms ease";
    });
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const sortedFines = [...sampleFines].sort((a, b) =>
    severityWeight(severityFor(b.amount)) - severityWeight(severityFor(a.amount))
  );

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", padding: "36px 24px", fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--ink)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--crimson)", marginBottom: 8 }}>
            Reference Guide
          </div>
          <h1 style={{ fontFamily: "'PT Serif', 'Georgia', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>
            Traffic Fine Categories
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--slate)" }}>
            Common traffic violations, their standard penalties, and how to resolve them.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sortedFines.map((fine) => {
            const isOpen = openId === fine.id;
            const severity = severityFor(fine.amount);
            const severityColor = SEVERITY_COLOR[severity];

            return (
              <div
                key={fine.id}
                onClick={() => toggle(fine.id)}
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--rule)",
                  borderLeft: `3px solid ${severityColor}`,
                  borderRadius: 3, overflow: "hidden", cursor: "pointer",
                  transition: "box-shadow .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ padding: "14px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{fine.icon}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>{fine.type}</div>
                        <div style={{ fontSize: 12, color: "var(--slate)" }}>{fine.short}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>
                          {fine.amount}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: severityColor }}>
                          {severity}
                        </span>
                      </div>
                    </div>

                    <div
                      ref={(el) => (refs.current[fine.id] = el)}
                      style={{
                        maxHeight: isOpen ? (refs.current[fine.id]?.scrollHeight || 400) + "px" : "0px",
                        overflow: "hidden",
                        transition: "max-height 280ms ease",
                        marginTop: isOpen ? 14 : 0,
                      }}
                    >
                      <div style={{
                        fontSize: 13, color: "var(--slate)", lineHeight: 1.7,
                        borderTop: "1px solid var(--paper-dk)", paddingTop: 14, marginBottom: 12,
                      }}>
                        {fine.desc}
                      </div>
                      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 12.5 }}>
                          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginRight: 6 }}>Evidence</span>
                          <span style={{ color: "var(--ink)" }}>Camera photo and timestamp available.</span>
                        </div>
                        <div style={{ fontSize: 12.5 }}>
                          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginRight: 6 }}>Resolution</span>
                          <span style={{ color: "var(--ink)" }}>Pay online, request a review, or contest within 14 days.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 10, color: "var(--muted)", flexShrink: 0, alignSelf: "center", paddingTop: 2 }}>
                    {isOpen ? "▲" : "▼"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
