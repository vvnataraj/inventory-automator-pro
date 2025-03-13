
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";
import { AlertOctagon, Search, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Static anomaly detection data
const anomalyData = [
  { 
    id: "anom1", 
    timestamp: "2024-07-10T14:23:15", 
    location: "Warehouse A", 
    item: "Premium Power Drill", 
    sku: "TLS-234", 
    expected: 18, 
    actual: 12, 
    difference: 6,
    value: 900,
    confidence: "high"
  },
  { 
    id: "anom2", 
    timestamp: "2024-07-09T10:45:30", 
    location: "Retail Floor", 
    item: "Wireless Security Camera", 
    sku: "ELC-567", 
    expected: 24, 
    actual: 20, 
    difference: 4,
    value: 720,
    confidence: "medium"
  },
  { 
    id: "anom3", 
    timestamp: "2024-07-08T16:12:45", 
    location: "Warehouse B", 
    item: "Smart Door Lock", 
    sku: "HRD-789", 
    expected: 15, 
    actual: 10, 
    difference: 5,
    value: 850,
    confidence: "high"
  },
  { 
    id: "anom4", 
    timestamp: "2024-07-07T09:30:15", 
    location: "Retail Floor", 
    item: "Premium Socket Set", 
    sku: "TLS-456", 
    expected: 12, 
    actual: 9, 
    difference: 3,
    value: 450,
    confidence: "medium"
  },
  { 
    id: "anom5", 
    timestamp: "2024-07-06T14:45:00", 
    location: "Warehouse A", 
    item: "Cordless Circular Saw", 
    sku: "TLS-789", 
    expected: 8, 
    actual: 5, 
    difference: 3,
    value: 525,
    confidence: "medium"
  },
];

// Time-based anomaly data
const timeBasedAnomalyData = [
  { time: "8 AM", anomalies: 0 },
  { time: "9 AM", anomalies: 1 },
  { time: "10 AM", anomalies: 2 },
  { time: "11 AM", anomalies: 1 },
  { time: "12 PM", anomalies: 0 },
  { time: "1 PM", anomalies: 0 },
  { time: "2 PM", anomalies: 4 },
  { time: "3 PM", anomalies: 5 },
  { time: "4 PM", anomalies: 3 },
  { time: "5 PM", anomalies: 2 },
  { time: "6 PM", anomalies: 1 },
  { time: "7 PM", anomalies: 0 },
];

// Location-based anomaly data
const locationBasedAnomalyData = [
  { location: "Warehouse A", anomalies: 12 },
  { location: "Warehouse B", anomalies: 8 },
  { location: "Retail Floor", anomalies: 15 },
  { location: "Receiving Dock", anomalies: 5 },
  { location: "Shipping Area", anomalies: 3 },
];

const getConfidenceColor = (confidence: string) => {
  switch(confidence) {
    case "high": return "text-red-500";
    case "medium": return "text-amber-500";
    case "low": return "text-blue-500";
    default: return "text-gray-500";
  }
};

const getBarColor = (count: number) => {
  if (count >= 4) return "#ef4444"; // Red
  if (count >= 2) return "#f59e0b"; // Amber
  return "#3b82f6"; // Blue
};

interface TheftDetectionProps {
  className?: string;
}

export const TheftDetection: React.FC<TheftDetectionProps> = ({ className }) => {
  const totalDetectedValue = anomalyData.reduce((sum, item) => sum + item.value, 0);
  const totalDetectedItems = anomalyData.reduce((sum, item) => sum + item.difference, 0);
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detected Incidents</CardTitle>
            <AlertOctagon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomalyData.length}</div>
            <p className="text-xs text-muted-foreground">In the last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value of Missing Items</CardTitle>
            <Search className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDetectedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated retail value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Item Count</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDetectedItems}</div>
            <p className="text-xs text-muted-foreground">Units unaccounted for</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Anomalies by Time of Day</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeBasedAnomalyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    return [`${value} incidents`, "Anomalies Detected"];
                  }}
                />
                <ReferenceLine y={3} stroke="#ff0000" strokeDasharray="3 3" />
                <Bar dataKey="anomalies" name="Anomalies">
                  {timeBasedAnomalyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.anomalies)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Anomalies by Location</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locationBasedAnomalyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="location" type="category" width={100} />
                <Tooltip 
                  formatter={(value, name) => {
                    return [`${value} incidents`, "Anomalies Detected"];
                  }}
                />
                <Bar dataKey="anomalies" name="Anomalies" fill="#8884d8">
                  {locationBasedAnomalyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.anomalies)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Anomaly Detections</span>
            <Badge variant="destructive">
              Investigate
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium">Item</th>
                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-right py-3 px-4 font-medium">Expected</th>
                  <th className="text-right py-3 px-4 font-medium">Actual</th>
                  <th className="text-right py-3 px-4 font-medium">Difference</th>
                  <th className="text-right py-3 px-4 font-medium">Value</th>
                  <th className="text-center py-3 px-4 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {anomalyData.map((anomaly) => (
                  <tr key={anomaly.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{new Date(anomaly.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4">{anomaly.item}</td>
                    <td className="py-3 px-4">{anomaly.sku}</td>
                    <td className="py-3 px-4">{anomaly.location}</td>
                    <td className="py-3 px-4 text-right">{anomaly.expected}</td>
                    <td className="py-3 px-4 text-right">{anomaly.actual}</td>
                    <td className="py-3 px-4 text-right font-medium text-red-500">
                      {anomaly.difference}
                    </td>
                    <td className="py-3 px-4 text-right">${anomaly.value}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getConfidenceColor(anomaly.confidence)}`}>
                        {anomaly.confidence.charAt(0).toUpperCase() + anomaly.confidence.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
