/**
 * Sample for Histogram series
 */
import React, { useEffect, useState } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, DataLabel, HistogramSeries, Logarithmic } from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';
// import { SampleBase } from '../common/sample-base';

const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }`;

export const Histogram = props => {

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        console.log(props.series)
        // setMin(Math.min( ...props.series ))
        // setMax(Math.max( ...props.series ))
        props.series.map((value) => {
            // let newElem = {
            //     y : value
            // }
            let newElem = {
                y : value
            }
            setChartData(chartData => [...chartData, newElem])
        });
    }, [props.series])
  
    // const printStateHandler = () => {
    //     console.log(chartData)
    // }
   
        return (
        
            <div className='control-pane'>
                <style>
                    {SAMPLE_CSS}
                </style>
                <div className='control-section'>
                    <ChartComponent id='charts' style={{ textAlign: "center" }} primaryXAxis={{ majorGridLines: { width: 0 }, 
                        title: 'Temperature in Celsius ' , minimum: Math.floor(props.min), maximum: Math.ceil(props.max), interval: 5}} 
                        primaryYAxis={{
                            title: 'Pixels',
                            valueType: 'Logarithmic',
                            minimum: 0, maximum: 4800, interval: 1,
                            majorTickLines: { width: 0 }, lineStyle: { width: 0 }
                        }}
                        chartArea={{ border: { width: 0 } }} tooltip={{ enable: true }}  width={'100%'} legendSettings={{ visible: false }} title='Temperature Histogram'>
                        <Inject services={[HistogramSeries, Legend, Tooltip, Category, DataLabel, Logarithmic]}/>
                        <SeriesCollectionDirective>
                            <SeriesDirective dataSource={chartData} yName='y' fill={'#0e955b'} name='Temp Occurence' type='Histogram' 
                                marker={{ dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }} 
                                showNormalDistribution={false} columnWidth={0.99} binInterval={1}>
                            </SeriesDirective>
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>

                {/* <button onClick={printStateHandler}>Click</button> */}
            </div>);
}