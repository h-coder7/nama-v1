export const numbersData = {
  items: [
    { value: "200", suffix: "thousand" },
    { value: "130", suffix: "thousand" },
    { value: "90", suffix: "thousand" },
  ],
  highlight: { value: "8", suffix: "million", unit: "frt" },
  /**
   * 2026 customer shipment data (sent by Namma, 23 Nov 2026): 16 customer accounts.
   * Totals: 2,548 shipments · 1,042 containers (13 accounts reported containers) ·
   * 33,499,764 kg gross weight ≈ 33,500 t. CBM was not published (incomplete column).
   */
  year: [
    { value: "2,548" },
    { value: "1,042" },
    { value: "33,500", plus: true },
  ],
} as const;
