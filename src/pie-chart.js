import React from "react";
import { View } from "react-native";
import { Svg, Rect, Text, G, Path } from "react-native-svg";
import AbstractChart from "./abstract-chart";

const Pie = require("paths-js/pie");

class PieChart extends AbstractChart {
  render() {
    const {
      style = {},
      backgroundColor,
      absolute = false,
      hasLegend = true
    } = this.props;
    const { borderRadius = 0 } = style;
    const chart = Pie({
      center: this.props.center || [0, 0],
      r: 60,
      R: this.props.height / 2.3,
      data: this.props.data,
      accessor: x => {
        return x[this.props.accessor];
      }
    });
    const total = this.props.data.reduce((sum, item) => {
      return sum + item[this.props.accessor];
    }, 0);
    const slices = chart.curves.map((c, i) => {
      let value;
      if (absolute) {
        value = c.item[this.props.accessor];
      } else {
        if (total === 0) {
          value = 0 + "%";
        } else {
          value = Math.round((100 / total) * c.item[this.props.accessor]) + "%";
        }
      }

      return (
        <G key={Math.random()}>
          <Text fontSize={16} fill={"#2e2e2e"} y={5} x={-40}>
            Top {this.props.data.length} Skills
          </Text>
          <Path
            d={c.sector.path.print()}
            fill={c.item.color}
            strokeWidth={2}
            stroke={"#fff"}
          />
          {hasLegend ? (
            <Rect
              width="12px"
              height="12px"
              fill={c.item.color}
              x={this.props.width / 2.5 - 24}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12
              }
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={c.item.legendFontColor}
              fontSize={c.item.legendFontSize}
              x={this.props.width / 2.5}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12 * 2
              }
            >
              {`${c.item.name}`}
            </Text>
          ) : null}
        </G>
      );
    });
    return (
      <View
        style={{
          width: 200,
          height: this.props.height,
          padding: 0,
          ...style
        }}
      >
        <Svg width={this.props.width} height={this.props.height}>
          <G>
            {this.renderDefs({
              width: this.props.height,
              height: this.props.height,
              ...this.props.chartConfig
            })}
          </G>
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill={backgroundColor}
          />
          <G
            x={
              this.props.width / 2 / 2 +
              Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
            }
            y={this.props.height / 2}
          >
            {slices}
          </G>
        </Svg>
      </View>
    );
  }
}

export default PieChart;
