import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

it("should render", async () => {
  render(<App />);
  const expectedElement = await screen.findByText(/hello, world/i);
  expect(expectedElement).toBeInTheDocument();
});
