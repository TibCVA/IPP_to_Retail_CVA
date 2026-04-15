import { useState } from "react";

const NAVY = "#051640";
const TEAL = "#00677A";
const TEAL_LIGHT = "#e6f2f5";
const ACCENT = "#E8A838";
const GREY_LIGHT = "#f5f6f8";
const GREY_MID = "#8b95a5";
const WHITE = "#ffffff";

// ─── DATA ───────────────────────────────────────────────────────────────────

const VALUE_CHAIN_STEPS = [
  {
    id: "production",
    label: "RES Production",
    subtitle: '"As Produced"',
    icon: "⚡",
    color: "#2E7D32",
    position: "start",
    description:
      "The renewable asset (wind turbine, solar park) injects electricity into the grid following its natural intermittent profile. Output depends on weather, season, and time of day — it is uncontrolled and unscheduled.",
    keyQuestion: "How do we transform an intermittent, unscheduled MWh into a tradable, bankable, deliverable product?",
    actors: ["IPP / Developer", "Asset Owner", "SPV (project company)"],
    economics: "Revenue = Captured Price × Volume. The 'captured price' is always ≤ baseload price due to the cannibalization effect (simultaneous production depresses spot prices).",
  },
  {
    id: "forecasting",
    label: "Forecasting",
    subtitle: "Output prediction",
    icon: "📊",
    color: "#1565C0",
    position: "mid",
    description:
      "Predicting RES output at various time horizons: week-ahead (portfolio planning), day-ahead (market bidding), intraday (position adjustment), and real-time (imbalance minimisation). Uses weather models, ML algorithms, and satellite data.",
    keyQuestion: "How accurately can we predict what the asset will produce, and over what time horizon?",
    actors: ["Forecasting service providers", "Aggregators (in-house)", "Trading desks", "Météo-type specialists"],
    economics: "A 1% improvement in forecast accuracy can reduce imbalance costs by 10–20%. Forecasting is rarely sold standalone — it is embedded in aggregation or trading services.",
  },
  {
    id: "nomination",
    label: "Nomination & Market Access",
    subtitle: "Grid scheduling",
    icon: "📋",
    color: "#4527A0",
    position: "mid",
    description:
      "Registering production schedules with the TSO (Transmission System Operator) and power exchange. The BRP (Balance Responsible Party) submits day-ahead nominations and updates them intraday. This is the 'licence to inject' into the market — without a BRP, a producer cannot sell.",
    keyQuestion: "Who holds the BRP licence and assumes the scheduling obligation?",
    actors: ["BRP (Balance Responsible Party)", "TSO (RTE, TenneT, etc.)", "Power Exchange (EPEX, Nord Pool)"],
    economics: "BRP status requires a licence, collateral with the TSO, and 24/7 operational capability. Fixed cost barrier that explains why most small/mid producers delegate this function.",
  },
  {
    id: "balancing",
    label: "Balancing",
    subtitle: "Imbalance risk management",
    icon: "⚖️",
    color: "#C62828",
    position: "mid",
    description:
      "Managing the gap between forecast/nominated volumes and actual production. Deviations trigger imbalance penalties from the TSO. The BRP continuously re-forecasts and trades intraday to minimise exposure. This is one of the highest-value intermediary services.",
    keyQuestion: "Who bears the financial risk of production deviations?",
    actors: ["BRP", "Aggregator", "Utility trading desk"],
    economics: "Imbalance prices can spike to 1,000–10,000+ €/MWh in stress events. Typical annual imbalance cost for a well-managed wind portfolio: 1–3 €/MWh. Poorly managed: 5–10+ €/MWh.",
  },
  {
    id: "aggregation",
    label: "Aggregation",
    subtitle: "Portfolio pooling",
    icon: "🔗",
    color: "#00695C",
    position: "mid",
    description:
      "Pooling multiple RES assets (different technologies, locations, sizes) into a single portfolio. This creates diversification benefits: uncorrelated wind/solar profiles partially offset each other, reducing overall forecast error and improving the quality of the aggregate output shape.",
    keyQuestion: "What is the optimal portfolio composition to maximise shape value and minimise imbalance?",
    actors: ["Aggregators (Statkraft, Vattenfall, Next Kraftwerke, EDF, etc.)", "VPP operators", "Large utilities"],
    economics: "Aggregation margin: 1–4 €/MWh depending on portfolio size and technology mix. Economies of scale are significant — larger portfolios have lower per-MWh costs.",
  },
  {
    id: "trading",
    label: "Trading & Market Bidding",
    subtitle: "Wholesale market execution",
    icon: "📈",
    color: "#E65100",
    position: "mid",
    description:
      "Selling the aggregated portfolio on wholesale power markets: forward/futures (months/years ahead), day-ahead auction (EPEX Spot), intraday continuous (up to 5 min before delivery), and balancing market. Algorithmic trading increasingly dominates short-term markets.",
    keyQuestion: "On which markets, at which time horizon, and through what instruments should the energy be sold?",
    actors: ["Energy traders", "Trading houses (Vitol, Trafigura, Gunvor)", "Utility trading desks", "Algo-traders (InCommodities, Enspired)"],
    economics: "Trading margin on RES portfolios: 0.5–3 €/MWh. However, skilled traders can capture significant alpha in volatile markets. Access to algorithmic trading capabilities increasingly differentiates top performers.",
  },
  {
    id: "hedging",
    label: "Hedging & Risk Management",
    subtitle: "Price risk transfer",
    icon: "🛡️",
    color: "#37474F",
    position: "mid",
    description:
      "Locking in future revenue through forward sales, futures, options, or swaps. For a RES producer, hedging means selling forward at a known price to reduce exposure to spot price volatility. The counterpart (bank, trader, utility) takes on the price risk in exchange for a margin.",
    keyQuestion: "What proportion of expected output should be hedged, at what tenor, and with whom?",
    actors: ["Banks (commodity desks)", "Trading houses", "Utilities", "Financial intermediaries"],
    economics: "The hedge premium reflects market volatility, tenor, and counterparty credit. Typically 2–8% below the forward curve for a 3–5 year RES hedge. The 'capture rate discount' is the key pricing parameter.",
  },
  {
    id: "shaping",
    label: "Shaping & Structuring",
    subtitle: "Profile transformation",
    icon: "🔄",
    color: "#AD1457",
    position: "mid",
    description:
      "Transforming the intermittent 'as produced' profile into structured, bankable products: baseload blocks, peak/off-peak tranches, shaped load-following profiles. This is the highest-value-add intermediary function — it bridges the gap between what RES produces and what buyers need.",
    keyQuestion: "How do we convert an intermittent curve into a flat baseload or a shaped load-following block?",
    actors: ["Utilities (EDF, Vattenfall, Statkraft)", "Specialised shapers", "BESS operators (for physical shaping)"],
    economics: "Shaping cost for wind-to-baseload: 5–15 €/MWh depending on market and profile quality. This is where BESS co-location creates maximum value: physical shaping via storage reduces reliance on market-based shaping.",
    subFunctions: [
      {
        name: "Market-based shaping",
        desc: "Buying/selling on spot markets to fill gaps and absorb surplus vs. baseload commitment",
      },
      {
        name: "Portfolio-based shaping (pooling)",
        desc: "Blending wind + solar + hydro to improve natural shape quality before market intervention",
      },
      {
        name: "BESS-based shaping",
        desc: "Using battery storage to physically shift production from surplus to deficit hours",
      },
    ],
  },
  {
    id: "ppa",
    label: "PPA Structuring & Pricing",
    subtitle: "Long-term offtake design",
    icon: "📝",
    color: "#1A237E",
    position: "mid",
    description:
      "Designing, pricing, and executing Power Purchase Agreements between RES producers and offtakers (corporates, utilities, traders). PPA structuring integrates all upstream services (forecasting, shaping, balancing) into a single commercial contract with defined price, volume, and risk terms.",
    keyQuestion: "What PPA structure optimally allocates risk between producer and offtaker?",
    actors: ["PPA advisors / consultants", "Utilities as sleeving partners", "Corporates as buyers", "Banks (project finance)"],
    economics: "PPA price = Forward baseload − Capture rate discount − Profile cost − Balancing cost − GoO premium + Credit risk margin. The intermediary margin is embedded in the spread between the producer's PPA price and the cost of the hedging/shaping book.",
    subFunctions: [
      { name: "Physical PPA", desc: "Direct delivery through the grid, requires BRP and sleeving partner" },
      { name: "Virtual / Synthetic PPA (vPPA)", desc: "Financial CfD settlement, no physical delivery — GoOs transferred separately" },
      { name: "Sleeved PPA", desc: "Utility intermediary manages physical flow and balancing between generator and corporate" },
      { name: "Clean Firm Power (CFP)", desc: "Next-gen PPA: baseload commitment from RES + storage/flex, e.g. TotalEnergies model" },
    ],
  },
  {
    id: "tolling",
    label: "Tolling & Optimisation",
    subtitle: "Asset dispatch rights",
    icon: "🏭",
    color: "#4E342E",
    position: "mid",
    description:
      "A tolling agreement transfers operational control (dispatch rights) of an asset to an offtaker/optimizer in exchange for fixed capacity payments. Originally from gas-to-power conversion, now widely used for BESS. The toller owns the asset; the offtaker decides when and how to charge/discharge.",
    keyQuestion: "Should the asset owner retain merchant exposure, or transfer dispatch control for revenue certainty?",
    actors: ["BESS developers (as tollers)", "Utilities & trading houses (as offtakers)", "Algo-optimisers (Enspired, Habitat Energy, Modo)"],
    economics: "BESS tolling prices in Europe: typically €110–150k/MW/year for 5–7 year terms. Physical tolls vs. financial tolls vs. floor+cap structures offer different risk/return profiles.",
  },
  {
    id: "intermediation",
    label: "Intermediation & Wholesaling",
    subtitle: "B2B matchmaking",
    icon: "🤝",
    color: "#00838F",
    position: "mid",
    description:
      "Matching supply (RES generators, aggregators) with demand (utilities, large industrials, retailers). Intermediaries may take a principal position (buying and reselling) or act as brokers. Includes GoO (Guarantee of Origin) trading and green certificate intermediation.",
    keyQuestion: "Is the intermediary a principal (taking position risk) or an agent (pure brokerage)?",
    actors: ["Energy brokers (Pexapark, Zeigo, LevelTen)", "Trading desks acting as principals", "GoO registries & traders"],
    economics: "Brokerage fees: 0.05–0.30 €/MWh. Principal trading margins depend on market position, credit, and risk appetite.",
  },
  {
    id: "retailing",
    label: "Retailing & Supply",
    subtitle: "End-customer delivery",
    icon: "🏠",
    color: "#880E4F",
    position: "end",
    description:
      "The final link: delivering electricity to end-consumers (residential, SME, industrial) under a supply contract. The retailer bundles energy sourcing, network access, billing, customer service, and regulatory compliance (taxes, levies, capacity mechanism contributions).",
    keyQuestion: "How does the retailer assemble its supply portfolio to match customer load at competitive prices?",
    actors: ["Energy retailers / suppliers (EDF, Engie, E.ON, Octopus, etc.)", "Municipal utilities", "Large industrials (direct market access)"],
    economics: "Retail margin: 2–8 €/MWh depending on segment and competition. The retailer's sourcing book combines PPAs, forward purchases, spot procurement, and balancing — assembling the 'shaped product' the customer needs.",
  },
];

const ACTOR_ARCHETYPES = [
  {
    name: "Pure-play IPP / Developer",
    icon: "🌱",
    scope: ["production"],
    description: "Develops and operates RES assets. Typically outsources everything beyond the meter — sells 'as produced' via a PPA or to an aggregator.",
    examples: "Boralex, Voltalia, Neoen, Ørsted (generation)",
  },
  {
    name: "Aggregator",
    icon: "🔗",
    scope: ["forecasting", "nomination", "balancing", "aggregation", "trading"],
    description: "Pools multiple small/mid RES producers into a managed portfolio. Provides market access, forecasting, balancing, and trading as a bundled service.",
    examples: "Next Kraftwerke, Statkraft (market access), Entelios",
  },
  {
    name: "Utility / Vertically Integrated Player",
    icon: "🏢",
    scope: ["production", "forecasting", "nomination", "balancing", "aggregation", "trading", "hedging", "shaping", "ppa", "intermediation", "retailing"],
    description: "Spans the full chain from generation to retail. Internalises all intermediary functions. Key competitive advantage: balance sheet, portfolio diversity, and customer base.",
    examples: "EDF, Vattenfall, Engie, E.ON, Iberdrola",
  },
  {
    name: "Energy Trader / Trading House",
    icon: "📊",
    scope: ["trading", "hedging", "shaping", "tolling", "intermediation"],
    description: "Monetises volatility and spread opportunities. Provides hedging, shaping, and optimisation services. Increasingly active in BESS tolling.",
    examples: "Vitol, Trafigura, Gunvor, InCommodities, Danske Commodities",
  },
  {
    name: "BESS Optimizer / Algo-Trader",
    icon: "🤖",
    scope: ["trading", "tolling"],
    description: "Software-driven dispatch and trading of storage assets. Maximises revenue across wholesale, balancing, and ancillary service markets. Often lacks balance sheet for guaranteed payments.",
    examples: "Enspired, Habitat Energy, Modo Energy, Limejump",
  },
  {
    name: "PPA Advisor / Broker",
    icon: "🤝",
    scope: ["ppa", "intermediation"],
    description: "Matches RES generators with corporate or utility offtakers. Provides price discovery, structuring advice, and transaction facilitation.",
    examples: "Pexapark, LevelTen, Zeigo (by Schneider Electric)",
  },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function StepCard({ step, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        background: isSelected ? NAVY : WHITE,
        border: `2px solid ${isSelected ? step.color : "#e0e4ea"}`,
        borderRadius: 12,
        padding: "16px 18px",
        transition: "all 0.25s ease",
        boxShadow: isSelected ? `0 4px 20px ${step.color}30` : "0 1px 4px rgba(0,0,0,0.06)",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>{step.icon}</span>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: isSelected ? WHITE : NAVY,
              lineHeight: 1.3,
            }}
          >
            {step.label}
          </div>
          <div
            style={{
              fontSize: 11,
              color: isSelected ? "#a0b4d0" : GREY_MID,
              fontStyle: "italic",
            }}
          >
            {step.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ step }) {
  if (!step) return null;
  return (
    <div
      style={{
        background: WHITE,
        borderRadius: 16,
        border: `2px solid ${step.color}`,
        padding: 28,
        boxShadow: `0 8px 32px ${step.color}15`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: `${step.color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {step.icon}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, color: NAVY, fontWeight: 800 }}>{step.label}</h2>
          <div style={{ fontSize: 13, color: step.color, fontWeight: 600, marginTop: 2 }}>
            {step.subtitle}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "#334155", margin: "0 0 18px 0" }}>
        {step.description}
      </p>

      {/* Key Question */}
      <div
        style={{
          background: `${step.color}10`,
          borderLeft: `4px solid ${step.color}`,
          padding: "12px 16px",
          borderRadius: "0 8px 8px 0",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: step.color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
          Key Strategic Question
        </div>
        <div style={{ fontSize: 13, color: NAVY, fontWeight: 600, lineHeight: 1.5 }}>
          {step.keyQuestion}
        </div>
      </div>

      {/* Economics */}
      <div
        style={{
          background: GREY_LIGHT,
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
          Economics & Value
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.6, color: "#475569" }}>{step.economics}</div>
      </div>

      {/* Sub-functions if any */}
      {step.subFunctions && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
            Sub-functions & Variants
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {step.subFunctions.map((sf, i) => (
              <div
                key={i}
                style={{
                  background: WHITE,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: step.color }}>{sf.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, lineHeight: 1.5 }}>
                  {sf.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actors */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
          Typical Actors
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {step.actors.map((a, i) => (
            <span
              key={i}
              style={{
                background: `${step.color}12`,
                color: step.color,
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid ${step.color}30`,
              }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActorCard({ archetype, selectedStep }) {
  const isActive = selectedStep && archetype.scope.includes(selectedStep.id);
  const activeCount = archetype.scope.length;
  return (
    <div
      style={{
        background: isActive ? `${TEAL}08` : WHITE,
        border: `1px solid ${isActive ? TEAL : "#e2e8f0"}`,
        borderRadius: 10,
        padding: "14px 16px",
        transition: "all 0.2s ease",
        opacity: selectedStep && !isActive ? 0.4 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{archetype.icon}</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>{archetype.name}</span>
      </div>
      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 8px 0" }}>
        {archetype.description}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: GREY_MID, fontStyle: "italic" }}>{archetype.examples}</span>
        <span
          style={{
            fontSize: 10,
            background: TEAL_LIGHT,
            color: TEAL,
            padding: "2px 8px",
            borderRadius: 10,
            fontWeight: 700,
          }}
        >
          {activeCount} functions
        </span>
      </div>
      {/* Scope bar */}
      <div style={{ display: "flex", gap: 2, marginTop: 8 }}>
        {VALUE_CHAIN_STEPS.map((s) => (
          <div
            key={s.id}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: archetype.scope.includes(s.id)
                ? selectedStep?.id === s.id
                  ? s.color
                  : TEAL
                : "#e8ecf1",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FlowDiagram({ selectedId, onSelect }) {
  return (
    <div style={{ overflowX: "auto", padding: "10px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 900 }}>
        {VALUE_CHAIN_STEPS.map((step, i) => (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <div
              onClick={() => onSelect(step.id)}
              style={{
                cursor: "pointer",
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: selectedId === step.id ? step.color : `${step.color}18`,
                border: `3px solid ${step.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                transition: "all 0.2s ease",
                boxShadow: selectedId === step.id ? `0 0 16px ${step.color}40` : "none",
                position: "relative",
              }}
              title={step.label}
            >
              {step.icon}
            </div>
            {i < VALUE_CHAIN_STEPS.length - 1 && (
              <div
                style={{
                  width: 14,
                  height: 3,
                  background:
                    selectedId === step.id || selectedId === VALUE_CHAIN_STEPS[i + 1]?.id
                      ? TEAL
                      : "#d0d5de",
                  borderRadius: 2,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, minWidth: 900, marginTop: 6 }}>
        {VALUE_CHAIN_STEPS.map((step, i) => (
          <div key={step.id} style={{ display: "flex", alignItems: "flex-start" }}>
            <div
              style={{
                width: 62,
                textAlign: "center",
                fontSize: 9,
                fontWeight: 600,
                color: selectedId === step.id ? step.color : GREY_MID,
                lineHeight: 1.2,
              }}
            >
              {step.label}
            </div>
            {i < VALUE_CHAIN_STEPS.length - 1 && <div style={{ width: 14 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Value chain economics summary
function EconomicsSummary() {
  const items = [
    { label: "Capture rate discount", value: "10–25%", desc: "vs. baseload, depending on tech & market" },
    { label: "Forecasting gain", value: "1–3 €/MWh", desc: "imbalance cost avoided" },
    { label: "Balancing cost", value: "1–10 €/MWh", desc: "depending on portfolio quality" },
    { label: "Aggregation margin", value: "1–4 €/MWh", desc: "for bundled market access" },
    { label: "Shaping cost", value: "5–15 €/MWh", desc: "wind-to-baseload conversion" },
    { label: "Trading alpha", value: "0.5–3 €/MWh", desc: "skilled execution vs. passive selling" },
    { label: "PPA structuring fee", value: "0.2–1 €/MWh", desc: "advisory / brokerage" },
    { label: "Retail margin", value: "2–8 €/MWh", desc: "customer-facing supply" },
  ];
  return (
    <div style={{ background: GREY_LIGHT, borderRadius: 12, padding: 20, marginTop: 0 }}>
      <h3 style={{ margin: "0 0 14px 0", fontSize: 15, color: NAVY, fontWeight: 800 }}>
        Cumulative Economics: From "As Produced" to Retail
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: WHITE,
              borderRadius: 8,
              padding: "10px 14px",
              borderLeft: `3px solid ${TEAL}`,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: TEAL }}>{item.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginTop: 2 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: GREY_MID, marginTop: 1 }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "#64748b", marginTop: 14, lineHeight: 1.6, fontStyle: "italic" }}>
        Total intermediary spread from "as produced" to retail typically amounts to 15–35 €/MWh — representing the full cost of transforming intermittent, unscheduled RES output into a firm, bankable, deliverable product matching consumer needs.
      </p>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  const [selectedStepId, setSelectedStepId] = useState("production");
  const [activeTab, setActiveTab] = useState("chain"); // chain | actors | economics

  const selectedStep = VALUE_CHAIN_STEPS.find((s) => s.id === selectedStepId) || VALUE_CHAIN_STEPS[0];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
        padding: 20,
        color: NAVY,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(135deg, ${NAVY}, ${TEAL})`,
            color: WHITE,
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 20,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          CVA ECT — Energy Value Chain Mapping
        </div>
        <h1 style={{ margin: "0 0 6px 0", fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
          From RES "As Produced" to Power Retail
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: GREY_MID, lineHeight: 1.5 }}>
          A comprehensive mapping of the 12 intermediary functions, business models, and actor archetypes that transform intermittent renewable output into a firm, deliverable retail product.
        </p>
      </div>

      {/* Flow Diagram */}
      <div
        style={{
          background: WHITE,
          borderRadius: 14,
          padding: "16px 20px",
          border: "1px solid #e2e8f0",
          marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <FlowDiagram selectedId={selectedStepId} onSelect={setSelectedStepId} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "chain", label: "Value Chain Functions" },
          { id: "actors", label: "Actor Archetypes" },
          { id: "economics", label: "Economics Summary" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `2px solid ${activeTab === tab.id ? TEAL : "#e2e8f0"}`,
              background: activeTab === tab.id ? TEAL : WHITE,
              color: activeTab === tab.id ? WHITE : NAVY,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "chain" && (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
          {/* Left: Step list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {VALUE_CHAIN_STEPS.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                isSelected={selectedStepId === step.id}
                onClick={() => setSelectedStepId(step.id)}
              />
            ))}
          </div>
          {/* Right: Detail panel */}
          <div style={{ position: "sticky", top: 20, alignSelf: "start" }}>
            <DetailPanel step={selectedStep} />
          </div>
        </div>
      )}

      {activeTab === "actors" && (
        <div>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 18 }}>
            Six actor archetypes span the value chain with very different scope and integration strategies. Click on a value chain step above to see which archetypes are active at that stage. The scope bars below each archetype show which functions they cover.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
            {ACTOR_ARCHETYPES.map((a) => (
              <ActorCard key={a.name} archetype={a} selectedStep={selectedStep} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "economics" && <EconomicsSummary />}

      {/* Footer insight */}
      <div
        style={{
          marginTop: 28,
          padding: "18px 22px",
          background: `linear-gradient(135deg, ${NAVY}, #0a2a5e)`,
          borderRadius: 14,
          color: WHITE,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: ACCENT, marginBottom: 6 }}>
          CVA Analytical Reading
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, opacity: 0.92 }}>
          The fundamental tension in this value chain is between <strong>internalisation</strong> (vertically integrated utilities capturing the full margin stack) and <strong>specialisation</strong> (best-of-breed players excelling at one or two functions). The rise of algorithmic trading, BESS co-location, and corporate PPA demand is reshaping where value concentrates. Three profit pools are expanding: <em>shaping</em> (as intermittency increases with higher RES penetration), <em>BESS optimisation</em> (as storage deployment scales), and <em>PPA structuring</em> (as corporates demand increasingly sophisticated "clean firm" products). For a RES developer, the strategic question is: which of these 12 functions should I internalise to capture margin, vs. outsource to focus on core competency?
        </p>
      </div>
    </div>
  );
}
