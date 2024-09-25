export interface ChartData{
    date: Date;
    price: number;
}

export function prepareChartData(data: ChartData[]){
    return {
        x: data.map(item => item.date.toISOString()), // Format date as YYYY-MM-DD for Plotly
        y: data.map(item => item.price),
    }
}