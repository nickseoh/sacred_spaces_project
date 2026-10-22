// Canned output for MOCK_AI=true, so the app can be demoed or tested without an API key.
export const mockFeasibility = (i, c) => ({
  verdict: "possible with relief",
  headline: `Your lot could support roughly ${c.units} ${c.t.label}, subject to parking requirements and confirmation of how housing co-located with a church is treated.`,
  constraints: [
    { rule: "Density", finding: `At the entered lot area per unit, the lot allows about ${c.byDensity} units.`, citation: null, confidence: "unverified" },
    { rule: "Setbacks", finding: `Setbacks of ${i.front}/${i.side}/${i.rear} ft shrink the buildable area.`, citation: null, confidence: "unverified" },
    { rule: "Parking", finding: `About ${c.unitParking} new spaces would be needed at ${i.pk} per unit.`, citation: null, confidence: "unverified" },
    { rule: "Use permission", finding: "Whether housing is allowed alongside a church needs confirmation.", citation: null, confidence: "unverified" },
  ],
  obstacles: [
    { obstacle: "Parking minimums", why: "Required spaces compete with land for homes.", counterpoint: "Shared parking honors both Sunday worship and weekday neighbors.", expert: "City planner" },
    { obstacle: "Neighbor concerns", why: "Change on a familiar lot can feel unsettling.", counterpoint: "Invite neighbors early; hospitality starts with listening.", expert: "Community engagement lead" },
    { obstacle: "Possible variance", why: "Small departures from standards need board approval.", counterpoint: "A modest request can serve a large need.", expert: "Land-use attorney" },
  ],
  financing: [
    { source: "Low-Income Housing Tax Credits", fit: "Could apply if the project is large enough; an advisor must confirm." },
    { source: "Faith-based housing funds", fit: "May offer early predevelopment support." },
  ],
  questions: ["Is housing permitted on this parcel alongside a church?", "Would a shared-parking analysis reduce required spaces?", "What does a site survey show about easements?", "Which utility upgrades would be needed?"],
  _mock: true,
});
export const mockPresentation = (i, c) => ({
  onepager: { title: `${i.church}: homes for our neighbors`, tagline: "An early look at what our land could become.", sections: [
    { heading: "Why we're exploring this", body: "Our lot sits empty most of the week. We believe it could serve neighbors who need a home." },
    { heading: "What might fit", body: `Early math suggests roughly ${c.units} ${c.t.label}. Experts will confirm.` },
    { heading: "What we've heard", body: "Parking and traffic matter. We plan to listen and design around them." },
    { heading: "Next steps", body: "Engage an architect, land-use attorney and city planner before any decision." } ] },
  talking_points: ["Church board", "Neighbors", "City council"].map((a) => ({ audience: a, points: ["This is an early exploration.", "Our aim is to love our neighbors well.", "Experts will review every number.", "We want your input."] })),
  slides: [
    { title: "Sacred spaces, safe homes", bullets: [i.church, i.address], notes: "Welcome and purpose." },
    { title: "Why this land, why now", bullets: ["Our lot sits empty six days a week", "Our neighbors need homes"], notes: "" },
    { title: "What might fit", bullets: [`Roughly ${c.units} ${c.t.label}`, "Subject to review"], notes: "" },
    { title: "Concerns we've heard", bullets: ["Parking", "Traffic", "Neighborhood character"], notes: "" },
    { title: "How we'd address them", bullets: ["Shared parking", "Small scale", "Ongoing conversation"], notes: "" },
    { title: "Paying for it", bullets: ["Possible tax credits and faith-based funds", "Preliminary only"], notes: "" },
    { title: "Next steps", bullets: ["Architect, attorney and planner review", "Community listening sessions"], notes: "" },
  ],
  _mock: true,
});
