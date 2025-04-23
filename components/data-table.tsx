"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample data
const initialData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    department: "Engineering",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Inactive",
    department: "Marketing",
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    status: "Active",
    department: "Sales",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "Active",
    department: "HR",
    joinDate: "2023-04-05",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "Admin",
    status: "Active",
    department: "Engineering",
    joinDate: "2023-05-12",
  },
  {
    id: 6,
    name: "Diana Miller",
    email: "diana@example.com",
    role: "Manager",
    status: "Inactive",
    department: "Finance",
    joinDate: "2023-06-18",
  },
  {
    id: 7,
    name: "Edward Davis",
    email: "edward@example.com",
    role: "User",
    status: "Active",
    department: "Marketing",
    joinDate: "2023-07-22",
  },
  {
    id: 8,
    name: "Fiona Clark",
    email: "fiona@example.com",
    role: "Admin",
    status: "Active",
    department: "Engineering",
    joinDate: "2023-08-30",
  },
  {
    id: 9,
    name: "George White",
    email: "george@example.com",
    role: "User",
    status: "Inactive",
    department: "Sales",
    joinDate: "2023-09-14",
  },
  {
    id: 10,
    name: "Hannah Green",
    email: "hannah@example.com",
    role: "Manager",
    status: "Active",
    department: "HR",
    joinDate: "2023-10-25",
  },
  {
    id: 11,
    name: "Ian Taylor",
    email: "ian@example.com",
    role: "User",
    status: "Active",
    department: "Finance",
    joinDate: "2023-11-05",
  },
  {
    id: 12,
    name: "Julia Adams",
    email: "julia@example.com",
    role: "Admin",
    status: "Inactive",
    department: "Engineering",
    joinDate: "2023-12-12",
  },
];

// Column definitions
const columns = [
  { id: "name", label: "Name", type: "text" },
  { id: "email", label: "Email", type: "text" },
  {
    id: "role",
    label: "Role",
    type: "select",
    options: ["Admin", "Manager", "User"],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
  },
  {
    id: "department",
    label: "Department",
    type: "select",
    options: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
  },
  { id: "joinDate", label: "Join Date", type: "date" },
];

export function DataTable() {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Apply filters and sorting
  useEffect(() => {
    let result = [...data];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].length > 0) {
        result = result.filter((item) => {
          const itemValue = String(item[key as keyof typeof item]);
          return filters[key].some((filterValue) =>
            itemValue.toLowerCase().includes(filterValue.toLowerCase())
          );
        });
      }
    });

    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [data, filters, sortConfig]);

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Handle filter changes for multiselect
  const handleFilterChange = (columnId: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
  };

  // Toggle a filter value
  const toggleFilterValue = (columnId: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[columnId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [columnId]: newValues.length > 0 ? newValues : [],
      };
    });
  };

  // Handle text filter input
  const handleTextFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value ? [value] : [],
    }));
  };

  // Clear a specific filter
  const clearFilter = (columnId: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setSortConfig(null);
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        items.push("ellipsis1");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push("ellipsis2");
      }

      // Always show last page
      items.push(totalPages);
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Records</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {Object.keys(filters).map((key) => {
            if (filters[key] && filters[key].length > 0) {
              return (
                <Badge
                  key={key}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {columns.find((col) => col.id === key)?.label}:
                  {filters[key].length === 1
                    ? filters[key][0]
                    : `${filters[key].length} selected`}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => clearFilter(key)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            }
            return null;
          })}
          {Object.keys(filters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.id} className="font-semibold">
                  <div className="flex items-center gap-1">
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => requestSort(column.id)}
                    >
                      {column.label}
                      {sortConfig?.key === column.id &&
                        (sortConfig.direction === "ascending" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 p-0 ml-1 ${
                            filters[column.id] && filters[column.id].length > 0
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60 p-3" align="start">
                        <div className="space-y-3">
                          <div className="font-medium">
                            Filter {column.label}
                          </div>

                          {column.type === "select" ? (
                            <ScrollArea className="h-60">
                              <div className="space-y-2">
                                {column.options?.map((option) => (
                                  <div
                                    key={option}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`${column.id}-${option}`}
                                      checked={(
                                        filters[column.id] || []
                                      ).includes(option)}
                                      onCheckedChange={() =>
                                        toggleFilterValue(column.id, option)
                                      }
                                    />
                                    <Label htmlFor={`${column.id}-${option}`}>
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          ) : (
                            <Input
                              placeholder="Filter..."
                              value={(filters[column.id] || [""])[0]}
                              onChange={(e) =>
                                handleTextFilterChange(
                                  column.id,
                                  e.target.value
                                )
                              }
                              className="h-8 text-sm"
                            />
                          )}

                          <div className="flex justify-between pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => clearFilter(column.id)}
                              disabled={
                                !filters[column.id] ||
                                filters[column.id].length === 0
                              }
                            >
                              Clear
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                document.dispatchEvent(new Event("click"))
                              }
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().length > 0 ? (
              getCurrentPageData().map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.id}`}>
                      {row[column.id as keyof typeof row]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPaginationItems().map((item, index) =>
              typeof item === "number" ? (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(item)}
                    isActive={currentPage === item}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-sm text-muted-foreground">
        Showing{" "}
        {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
        {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
        {filteredData.length} entries
        {filteredData.length !== data.length &&
          ` (filtered from ${data.length} total entries)`}
      </div>
    </div>
  );
}
