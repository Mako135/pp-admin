"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";
import { ChevronDown } from "lucide-react";

export interface TableSection<T> {
  tag: string;
  items: T[];
  color?: string;
}

export interface UnifiedTableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

interface UnifiedTableProps<T> {
  title: string;
  columns: UnifiedTableColumn<T>[];
  data: T[];
  groupByKey?: keyof T;
  groupByLabel?: string;
  getGroupColor?: (group: string) => string;
  emptyMessage?: string;
  renderActions?: (item: T) => React.ReactNode;
}

export function UnifiedTable<T extends { id: number | string }>({
  title,
  columns,
  data,
  groupByKey,
  groupByLabel = "Категория",
  getGroupColor,
  emptyMessage = "Нет данных",
  renderActions,
}: UnifiedTableProps<T>) {
  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : [];

  const sections = useMemo(() => {
    if (!groupByKey) {
      return [{ tag: "Все", items: dataArray }];
    }

    const grouped = dataArray.reduce(
      (acc, item) => {
        const groupValue = String(item[groupByKey] || "Без группы");
        if (!acc[groupValue]) {
          acc[groupValue] = [];
        }
        acc[groupValue].push(item);
        return acc;
      },
      {} as Record<string, T[]>
    );

    return Object.entries(grouped).map(([tag, items]) => ({
      tag,
      items,
      color: getGroupColor?.(tag),
    }));
  }, [dataArray, groupByKey, getGroupColor]);

  if (dataArray.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card key={`${section.tag}-${index}`}>
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {section.items.length}
                  </Badge>
                  {section.tag !== "Все" && (
                    <Badge
                      style={{
                        backgroundColor: section.color || "#e5e7eb",
                      }}
                      className="text-white"
                    >
                      {section.tag}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={String(column.key)} className={column.className}>
                          {column.label}
                        </TableHead>
                      ))}
                      {renderActions && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.items.map((item) => (
                      <TableRow key={item.id}>
                        {columns.map((column) => (
                          <TableCell
                            key={`${item.id}-${String(column.key)}`}
                            className={column.className}
                          >
                            {column.render
                              ? column.render((item as any)[column.key], item)
                              : String((item as any)[column.key])}
                          </TableCell>
                        ))}
                        {renderActions && (
                          <TableCell>{renderActions(item)}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}
