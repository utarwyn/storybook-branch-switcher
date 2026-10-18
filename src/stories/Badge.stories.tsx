import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    style={{
      background: color,
      color: "#fff",
      padding: "4px 12px",
      borderRadius: 12,
      fontFamily: "sans-serif",
      fontSize: 14,
    }}
  >
    {label}
  </span>
);

const meta = {
  title: "Example/Badge",
  component: Badge,
  args: { label: "Hello branch", color: "#1ea7fd" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: { label: "Merged", color: "#2da44e" },
};

export const Danger: Story = {
  args: { label: "Failing", color: "#cf222e" },
};
