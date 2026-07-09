import mongoose from "mongoose";

export interface IPortfolio {
  userId: string;
  name: string;
  college: string;
  skills: string;
  contact: string;
  theme: string;
  projects: Array<{ title: string; description: string }>;
  isPublished: boolean;
}

const PortfolioSchema = new mongoose.Schema<IPortfolio>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, default: "Alex Developer" },
    college: { type: String, default: "Tech University" },
    skills: { type: String, required: true, default: "Frontend Developer" },
    contact: { type: String, default: "hello@example.com" },
    theme: { type: String, required: true, default: "minimalist" },
    projects: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
