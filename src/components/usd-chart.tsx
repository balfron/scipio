import * as React from "react";
import { mockData, DataPoint, DataSet } from "./mock-data";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const USE_MOCK_DATA = true;

const convertData = (json: DataSet): Highcharts.PointOptionsObject[] => {
  return Object.keys(json).map((key: string) => {
    const data: DataPoint = json[key];
    return {
      x: data.time * 1000,
      y: parseFloat(data.amount_usd.toFixed(2)),
    };
  });
};

const getOptions = (
  data: Highcharts.PointOptionsObject[]
): Highcharts.Options => ({
  chart: {
    type: "spline",
  },
  title: {
    text: "1-minute agent consensus portfolio value (USD)",
  },
  series: [
    {
      name: "USD",
      type: "line",
      data: data,
    },
  ],
  xAxis: {
    type: "datetime",
  },
  yAxis: {
    title: {
      text: "USD",
    },
  },
  credits: {
    href: "https://cb1minmvp.firebaseio.com/trades.json",
    text: "Source: https://cb1minmvp.firebaseio.com/trades.json",
  },
});

export class UsdChart extends React.Component {
  state = {
    hasErrors: false,
    data: [],
  };

  componentDidMount() {
    if (USE_MOCK_DATA) {
      this.setState({ data: convertData(mockData) });
    } else {
      fetch("https://cb1minmvp.firebaseio.com/trades.json")
        .then((res) => res.json())
        .then((res) => this.setState({ data: convertData(res) }))
        .catch(() => this.setState({ hasErrors: true }));
    }
  }

  render() {
    return (
      <div>
        {this.state.hasErrors ? (
          <div>An error occured fetching data. See console for output.</div>
        ) : (
          <HighchartsReact
            constructorType={"stockChart"}
            highcharts={Highcharts}
            options={getOptions(this.state.data)}
          />
        )}
      </div>
    );
  }
}
