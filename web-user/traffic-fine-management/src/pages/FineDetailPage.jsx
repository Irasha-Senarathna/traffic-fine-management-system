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
];

export default function FineDetailPage() {
  const [openId, setOpenId] = useState(null);
  const refs = useRef({});

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
  return (
    <div>
      <h1 className="mb-4">Fine Details</h1>

      <div className="d-flex flex-column gap-2">
        {sampleFines.map((fine) => {
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
                      <h5 className="card-title mb-1">{fine.type}</h5>
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
