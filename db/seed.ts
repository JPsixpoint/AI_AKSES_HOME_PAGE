import { db } from "./index";
import * as schema from "@shared/schema";
import { deals } from "@shared/schema";

async function seed() {
  try {
    // Seed sample deals
    const existingDeals = await db.query.deals.findMany({
      limit: 1
    });
    
    if (existingDeals.length === 0) {
      console.log("Seeding deals data...");
      
      const dealsData = [
        {
          company: "Fintech Solutions Ltd.",
          subSector: "Payment Processing",
          value: 2500000,
          region: "Southeast Asia",
          sector: "Fintech",
          status: "Due Diligence",
          leadInvestor: "SixPoint Capital",
          deadline: new Date("2023-06-15"),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          notes: "Strong team with prior exits. Technology showing promising traction.",
        },
        {
          company: "Pay Global Inc.",
          subSector: "Digital Payments",
          value: 4200000,
          region: "North America",
          sector: "Fintech",
          status: "Due Diligence",
          leadInvestor: "SixPoint Capital",
          deadline: new Date("2023-07-01"),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          notes: "Expanding to Latin American markets. Due diligence focusing on regulatory compliance.",
        },
        {
          company: "Credit Access Partners",
          subSector: "Lending Platform",
          value: 1800000,
          region: "Europe",
          sector: "Lending",
          status: "Due Diligence",
          leadInvestor: "Venture East",
          deadline: new Date("2023-06-30"),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          notes: "Innovative risk assessment algorithms. Potential regulatory concerns in certain markets.",
        },
        {
          company: "Mobile Money Solutions",
          subSector: "Mobile Banking",
          value: 3100000,
          region: "Africa",
          sector: "Mobile Banking",
          status: "Indicative Proposal",
          leadInvestor: "Africa Growth Fund",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          notes: "Strong penetration in unbanked populations. Need more clarity on customer acquisition costs.",
        },
        {
          company: "Crypto Payment Tech",
          subSector: "Blockchain Solutions",
          value: 2800000,
          region: "Global",
          sector: "Blockchain",
          status: "Indicative Proposal",
          leadInvestor: "Blockchain Ventures",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          notes: "Novel settlement protocol. Regulatory landscape remains uncertain.",
        },
        {
          company: "InsurTech Innovations",
          subSector: "Insurance Technology",
          value: 1500000,
          region: "Asia Pacific",
          sector: "Insurance",
          status: "Prescreening",
          leadInvestor: "Tech Seeds Asia",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          notes: "Early stage but promising ML models for risk assessment.",
        },
        {
          company: "Remittance Connect",
          subSector: "Cross-border Payments",
          value: 3500000,
          region: "Latin America",
          sector: "Payments",
          status: "Indicative Proposal",
          leadInvestor: "LatAm Ventures",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
          notes: "Strong corridor focus between US and Mexico. Exploring expansion to other regions.",
        },
        {
          company: "Wealth Management AI",
          subSector: "Investment Technology",
          value: 4800000,
          region: "North America",
          sector: "WealthTech",
          status: "Prescreening",
          leadInvestor: "Future Finance VC",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
          notes: "AI-driven portfolio allocation with promising early returns. Regulatory approvals pending.",
        },
        {
          company: "SME Lending Solutions",
          subSector: "Business Loans",
          value: 2200000,
          region: "Europe",
          sector: "Lending",
          status: "Prescreening",
          leadInvestor: "Growth Capital Partners",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          notes: "Alternative data approach to credit scoring for small businesses.",
        },
        {
          company: "Biometric Payments",
          subSector: "Authentication",
          value: 1900000,
          region: "Middle East",
          sector: "Security",
          status: "Indicative Proposal",
          leadInvestor: "SixPoint Capital",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
          notes: "Novel authentication method with strong initial bank partnerships.",
        },
        {
          company: "Digital Banking Core",
          subSector: "Banking Infrastructure",
          value: 5500000,
          region: "North America",
          sector: "Banking",
          status: "Prescreening",
          leadInvestor: "Financial Innovation Fund",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17), // 17 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
          notes: "Core banking replacement for community banks. Strong team from traditional banking.",
        },
        {
          company: "Robo-Advisor Platform",
          subSector: "Automated Investing",
          value: 3200000,
          region: "Europe",
          sector: "WealthTech",
          status: "Prescreening",
          leadInvestor: "Tech Growth Capital",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19), // 19 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          notes: "White-label robo-advisor for wealth managers. Promising sales pipeline.",
        },
        {
          company: "Global Trade Finance",
          subSector: "Trade Finance",
          value: 4100000,
          region: "Global",
          sector: "Finance",
          status: "Committed",
          leadInvestor: "SixPoint Capital",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25), // 25 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          notes: "Blockchain-based trade finance platform with several bank pilots already running.",
        },
        {
          company: "Compliance AI",
          subSector: "RegTech",
          value: 2900000,
          region: "North America",
          sector: "Regulation",
          status: "Committed",
          leadInvestor: "Fintech Partners",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          notes: "AI-driven compliance monitoring with impressive early client list.",
        },
        {
          company: "Digital Asset Custody",
          subSector: "Crypto Storage",
          value: 3800000,
          region: "Global",
          sector: "Blockchain",
          status: "Closed",
          leadInvestor: "Blockchain Capital",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          notes: "Institutional-grade crypto custody with insurance coverage.",
        }
      ];
      
      for (const deal of dealsData) {
        await db.insert(deals).values(deal);
      }
      
      console.log("Deals data seeded successfully!");
    } else {
      console.log("Deals data already exists, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
