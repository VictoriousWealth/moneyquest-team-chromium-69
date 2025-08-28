import { useState } from "react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Scan, Zap, TrendingUp, TrendingDown } from "lucide-react";

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  size: number;
  unit: string;
  previousPrice?: number;
  previousSize?: number;
}

interface ValueScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (itemId: string) => void;
  scannedItem?: ScannedItem;
}

export const ValueScanner = ({ isOpen, onClose, onScan, scannedItem }: ValueScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);

  const calculateUnitPrice = (price: number, size: number) => {
    return (price / size) * 100; // per 100ml/g
  };

  const formatUnitPrice = (unitPrice: number, unit: string) => {
    return `£${unitPrice.toFixed(2)}/100${unit}`;
  };

  const handleScan = (itemId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      onScan(itemId);
      setIsScanning(false);
    }, 1500);
  };

  const getPriceChange = (current: ScannedItem) => {
    if (!current.previousPrice || !current.previousSize) return null;
    
    const currentUnitPrice = calculateUnitPrice(current.price, current.size);
    const previousUnitPrice = calculateUnitPrice(current.previousPrice, current.previousSize);
    
    const change = ((currentUnitPrice - previousUnitPrice) / previousUnitPrice) * 100;
    return change;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card shadow-game border-primary border-2">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scan className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Value Scanner</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {!scannedItem && (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center ${
                  isScanning ? "animate-pulse-glow" : ""
                }`}>
                  <Scan className={`w-8 h-8 text-primary ${isScanning ? "animate-spin" : ""}`} />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">Point scanner at items to reveal their true value!</p>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => handleScan("juice-250ml")}
                  disabled={isScanning}
                  className="w-full shadow-game hover:shadow-game-hover flex items-center justify-center gap-2"
                >
                  {isScanning ? "Scanning..." : (
                    <>
                      <img src="/lovable-uploads/7f571ee2-895c-40b2-9cd8-9481cd3dbb9f.png" alt="Orange Juice" className="w-5 h-5" />
                      Scan Orange Juice (250ml)
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => handleScan("juice-220ml")}
                  disabled={isScanning}
                  variant="outline"
                  className="w-full shadow-game hover:shadow-game-hover flex items-center justify-center gap-2"
                >
                  {isScanning ? "Scanning..." : (
                    <>
                      <img src="/lovable-uploads/7f571ee2-895c-40b2-9cd8-9481cd3dbb9f.png" alt="Orange Juice" className="w-5 h-5" />
                      Scan Orange Juice (220ml)
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {scannedItem && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">{scannedItem.name}</h3>
                <div className="text-2xl font-bold text-primary">£{scannedItem.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">{scannedItem.size}{scannedItem.unit}</div>
              </div>

              <Card className="p-4 bg-gradient-water/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-warning" />
                  <span className="font-semibold text-foreground">Unit Price Analysis</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {formatUnitPrice(calculateUnitPrice(scannedItem.price, scannedItem.size), scannedItem.unit)}
                </div>
                
                {getPriceChange(scannedItem) !== null && (
                  <div className="flex items-center gap-1 mt-2">
                    {getPriceChange(scannedItem)! > 0 ? (
                      <TrendingUp className="w-4 h-4 text-destructive" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-success" />
                    )}
                    <span className={`text-sm font-medium ${
                      getPriceChange(scannedItem)! > 0 ? "text-destructive" : "text-success"
                    }`}>
                      {getPriceChange(scannedItem)! > 0 ? "+" : ""}{getPriceChange(scannedItem)!.toFixed(1)}% vs yesterday
                    </span>
                  </div>
                )}
              </Card>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleScan("compare-item")}
                  variant="outline"
                  className="flex-1 shadow-game hover:shadow-game-hover"
                >
                  Compare Another
                </Button>
                <Button 
                  onClick={onClose}
                  className="flex-1 shadow-game hover:shadow-game-hover"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};