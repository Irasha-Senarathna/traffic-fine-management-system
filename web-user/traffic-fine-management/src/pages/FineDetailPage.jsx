import React, { useState, useRef, useEffect } from "react";

const sampleFines = [
  {
    id: 1,
    type: "Speeding",
    icon: "🚗",
    amount: "50 USD",
    short: "Driving above the speed limit",
    desc: "You were recorded driving at 80 km/h in a 60 km/h zone. This violation is classified as a speeding offense. Typical penalties include a monetary fine and license points. Repeated offenses may result in higher fines, license suspension, or mandatory driving courses. Recommended actions: review the attached evidence, pay the fine online to avoid late fees, or file a contest within the allowed timeframe if you believe this is incorrect.",
  },
  {
    id: 2,
    type: "Illegal Parking",
    icon: "🅿️",
    amount: "30 USD",
    short: "Parking in a no-parking zone",
    desc: "Vehicle parked in a restricted area (e.g., near a fire hydrant, bus stop, or disabled bay). This causes obstruction and safety hazards. Penalties usually include a fine and may include towing charges if the vehicle was removed. Recommended actions: check for photos and location details, pay the fine to avoid additional fees, or request review if signage was unclear.",
  },
  {
    id: 3,
    type: "Signal Violation",
    icon: "🚦",
    amount: "40 USD",
    short: "Running a red light or disobeying traffic signals",
    desc: "Failure to obey traffic signals (running red lights, ignoring stop signs). This is a serious safety risk and can lead to collisions. Penalties commonly include fines, license points, and in some jurisdictions mandatory court appearance for severe cases. Recommended actions: review incident time and camera evidence, pay the fine if valid, and attend any required hearings.",
  },
  {
    id: 4,
    type: "Overtaking (Unsafe)",
    icon: "↗️",
    amount: "75 USD",
    short: "Dangerous or prohibited overtaking maneuver",
    desc: "Overtaking in a no-overtake zone or performing a risky pass that endangers other road users. This often carries heavier penalties due to high collision risk. Typical consequences include fines, license points, and possible suspension for repeated offenders. Recommended actions: review dashcam or camera evidence, and pay or contest with evidence.",
  },
  {
    id: 5,
    type: "Cutting Road Lines / Lane Markings",
    icon: "🚧",
    amount: "60 USD",
    short: "Crossing or ignoring lane/divider markings",
    desc: "Crossing solid lines, cutting across lane dividers, or otherwise ignoring road markings that guide safe vehicle flow. Such behavior disrupts traffic and increases crash risk. Penalties often include fines and warnings; repeat cases may escalate. Recommended actions: inspect location images and pay or request review.",
  },
  {
    id: 6,
    type: "Illegal U-turn",
    icon: "🔄",
    amount: "45 USD",
    short: "Performing a U-turn where prohibited",
    desc: "Making a U-turn at locations where it is forbidden or unsafe. This can cause sudden conflicts with oncoming traffic. Penalties generally include fines and sometimes points. Check signage and evidence before responding.",
  },
  {
    id: 7,
    type: "Reckless Driving",
    icon: "⚠️",
    amount: "150 USD",
    short: "Driving that shows disregard for safety",
    desc: "Speeding combined with risky maneuvers, tailgating, or weaving at high speed qualifies as reckless driving. This is treated severely and may lead to large fines, license suspension, or court summons. Review incident details carefully and consult legal advice if necessary.",
  },
  {
    id: 8,
    type: "No Helmet (Motorcycle)",
    icon: "🪖",
    amount: "25 USD",
    short: "Riding without a helmet",
    desc: "Motorcycle riders and passengers must wear approved helmets. Violations endanger riders and typically result in fines and possible vehicle impoundment for repeat offenses. Evidence usually includes photos from roadside cameras.",
  },
  {
    id: 9,
    type: "Seatbelt Violation",
    icon: "🔒",
    amount: "20 USD",
    short: "Driver or passenger without seatbelt",
    desc: "Failure to wear a seatbelt increases injury risk in collisions. Enforcement commonly issues small fines and reminders. If you believe the fine is incorrect, review vehicle camera or enforcement logs.",
  },
  {
    id: 10,
    type: "Blocking Intersection",
    icon: "🚫",
    amount: "55 USD",
    short: "Stopping in the intersection and obstructing flow",
    desc: "Blocking an intersection causes congestion and safety hazards. Penalties include fines and may carry higher charges during peak traffic or emergency routes. Check the incident time and related evidence.",
  },
];

export default function FineDetailPage() {
  const [openId, setOpenId] = useState(null);
  const refs = useRef({});

  function parseAmount(a) {
    if (a == null) return 0;
    const s = String(a);
    const num = Number(s.replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  }

  function severityForAmount(amount) {
    const a = parseAmount(amount);
    if (a > 100) return "High";
    if (a > 50) return "Medium";
    return "Low";
  }

  function severityWeight(s) {
    if (s === "High") return 3;
    if (s === "Medium") return 2;
    return 1;
  }

  function severityClass(s) {
    if (s === "High")
      return { border: "border-danger", badge: "bg-danger text-white" };
    if (s === "Medium")
      return { border: "border-warning", badge: "bg-warning text-dark" };
    return { border: "border-success", badge: "bg-success text-white" };
  }

  // ensure max-heights update when toggling (in case content/layout changes)
  useEffect(() => {
    Object.values(refs.current).forEach((el) => {
      if (!el) return;
      el.style.transition = "max-height 280ms ease";
    });
  }, []);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };
  // sort sample fines by severity (high -> low)
  const sortedFines = [...sampleFines].sort((a, b) => {
    const sa = severityForAmount(a.amount);
    const sb = severityForAmount(b.amount);
    return severityWeight(sb) - severityWeight(sa);
  });

  return (
    <div>
      <h1 className="mb-4">Fine Details</h1>

      <div className="d-flex flex-column gap-2">
        {sortedFines.map((fine) => {
          const isOpen = openId === fine.id;
          return (
            <div
              key={fine.id}
              className="card"
              onClick={() => toggle(fine.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex align-items-start">
                <div style={{ fontSize: 28, width: 48 }}>{fine.icon}</div>
                <div className="flex-grow-1 ms-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title mb-1">
                        {fine.type}
                        <span
                          className={`badge ms-2 ${severityClass(severityForAmount(fine.amount)).badge}`}
                        >
                          {severityForAmount(fine.amount)}
                        </span>
                      </h5>
                      <div className="text-muted small">{fine.short}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{fine.amount}</div>
                      <div className="text-muted small">
                        {isOpen ? "Click to collapse" : "Click to expand"}
                      </div>
                    </div>
                  </div>

                  <div
                    ref={(el) => (refs.current[fine.id] = el)}
                    style={{
                      maxHeight: isOpen
                        ? refs.current[fine.id]?.scrollHeight + "px"
                        : "0px",
                      overflow: "hidden",
                      transition: "max-height 280ms ease",
                      marginTop: isOpen ? 12 : 0,
                    }}
                  >
                    <div className="text-muted">{fine.desc}</div>
                    <div className="mt-2">
                      <strong>Evidence:</strong> Camera photo and timestamp
                      available.
                    </div>
                    <div className="mt-1">
                      <strong>How to resolve:</strong> Pay online, request a
                      review, or follow contest procedures within 14 days.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
