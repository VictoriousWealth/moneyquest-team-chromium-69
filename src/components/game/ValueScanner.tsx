import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Search, X } from "lucide-react";

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
  onItemScanned: (item: ScannedItem) => void;
}

export const ValueScanner: React.FC<ValueScannerProps> = ({
  isOpen,
  onClose,
  onItemScanned
}) => {
  const [scanning, setScanning] = useState(false);

  const mockItems: ScannedItem[] = [
    {
      id: "juice1",
      name: "Orange Juice",
      price: 3.50,
      size: 500,
      unit: "ml",
      previousPrice: 3.50,
      previousSize: 550
    },
    {
      id: "juice2", 
      name: "Apple Juice",
      price: 4.00,
      size: 600,
      unit: "ml"
    },
    {
      id: "juice3",
      name: "Grape Juice", 
      price: 5.00,
      size: 750,
      unit: "ml"
    }
  ];

  const handleScan = (item: ScannedItem) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onItemScanned(item);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Value Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-[var(--subtext)] text-sm">
            Scan items to reveal their price and size information:
          </p>

          {scanning && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-[var(--text)]">Scanning item...</p>
            </div>
          )}

          {!scanning && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mockItems.map((item) => (
                <Card 
                  key={item.id}
                  className="p-4 cursor-pointer hover:bg-[var(--muted)]/50 transition-colors"
                  onClick={() => handleScan(item)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--text)]">{item.name}</h4>
                      <p className="text-sm text-[var(--subtext)]">
                        Click to scan
                      </p>
                    </div>
                    <Search className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};