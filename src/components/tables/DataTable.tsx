import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, Filter } from 'lucide-react';

export interface FilterConfig {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface Column {
  header: string;
  accessor: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  filters?: FilterConfig[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  filters = [], 
  searchTerm, 
  onSearchTermChange 
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ring rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Filters */}
          {filters.map((filter) => (
            <div key={filter.id} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                {filter.label}
              </label>
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-3 py-2 border border-ring rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-ring">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ring">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="text-muted-foreground">
                      <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No students found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 text-sm text-foreground"
                      >
                        {row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DataTable;