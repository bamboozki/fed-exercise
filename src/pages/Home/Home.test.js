import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
import Papa from "papaparse";

global.fetch = jest.fn();

jest.mock("papaparse", () => ({
  parse: jest.fn(),
}));

describe("Home Component", () => {
  const mockData = [
    {
      _id: "1",
      "Reported Date": "01/07/2019",
      "Suburb - Incident": "ADELAIDE",
      "Postcode - Incident": "5000",
      "Offence Level 1 Description": "OFFENCES AGAINST PROPERTY",
      "Offence Level 2 Description": "FRAUD DECEPTION AND RELATED OFFENCES",
      "Offence Level 3 Description": "Obtain benefit by deception",
      "Offence count": "1",
    },
    {
      _id: "2",
      "Reported Date": "01/07/2019",
      "Suburb - Incident": "ADELAIDE",
      "Postcode - Incident": "5000",
      "Offence Level 1 Description": "OFFENCES AGAINST PROPERTY",
      "Offence Level 2 Description": "FRAUD DECEPTION AND RELATED OFFENCES",
      "Offence Level 3 Description": "Other fraud, deception and related offences",
      "Offence count": "1",
    },
  ];

  beforeEach(() => {
    fetch.mockResolvedValue({
      text: () => Promise.resolve("mock,csv,data"),
    });

    Papa.parse.mockImplementation((csvText, options) => {
      options.complete({ data: mockData });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders component and shows parsed CSV data", async () => {
    render(<Home />);

    expect(await screen.findByText(/Crime Records/i)).toBeInTheDocument();

    const accordionHeader = await screen.findByText(/ADELAIDE \(2\)/);
    fireEvent.click(accordionHeader);

    const dateCells = await screen.findAllByText(/01\/07\/2019/);
    expect(dateCells).toHaveLength(2);
    const suburbCells = await screen.findAllByText(/ADELAIDE/);
    expect(suburbCells).toHaveLength(3);
    expect(screen.getByText(/Obtain benefit by deception/)).toBeInTheDocument();
  });

  test("toggles grouping on button click", async () => {
    render(<Home />);
    const accordionHeader = await screen.findByText(/ADELAIDE \(2\)/);
    fireEvent.click(accordionHeader);

    const button = screen.getByRole("button", {
      name: /Regroup by Offence Level 2 Description/i,
    });

    fireEvent.click(button);

    expect(
      screen.getByRole("button", {
        name: /Regroup by Suburb - Incident/i,
      })
    ).toBeInTheDocument();
  });

  test("does not render _id column", async () => {
    render(<Home />);
    const accordionHeader = await screen.findByText(/ADELAIDE \(2\)/);
    fireEvent.click(accordionHeader);

    expect(screen.queryByText(/_id/i)).not.toBeInTheDocument();
  });

  test("accordion expands to show record data", async () => {
    render(<Home />);
    const accordionHeader = await screen.findByText(/ADELAIDE \(2\)/);
    fireEvent.click(accordionHeader);

    expect(screen.getByText(/Other fraud, deception and related offences/)).toBeInTheDocument();
  });
});
