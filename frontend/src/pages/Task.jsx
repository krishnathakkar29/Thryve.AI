import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  CircleIcon,
  Clock3Icon,
  FilterIcon,
  MoreVertical,
  XCircleIcon,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/App";
import { EditTaskDialog } from "@/components/task/edit-task-dialog";

const statusIcons = {
  Open: <CircleIcon className="h-4 w-4" />,
  InProgress: <Clock3Icon className="h-4 w-4" />,
  Completed: <CheckCircle2Icon className="h-4 w-4" />,
  Blocked: <XCircleIcon className="h-4 w-4" />,
};

const priorityIcons = {
  Low: <ArrowDownIcon className="h-4 w-4" />,
  Medium: <CircleDotIcon className="h-4 w-4" />,
  High: <ArrowUpIcon className="h-4 w-4" />,
};

function Task() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data } = useQuery({ queryKey: ["authUser"] });
  const isIntern = data?.user?.role === "Intern";

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchInternTasks"],
    queryFn: async () => {
      const response = await api.get("/api/task/assigned-to-me");
      return response.data.tasks;
    },
  });

  const handleEditClick = (task) => {
    if (isIntern) {
      setSelectedTask(task);
      setIsEditDialogOpen(true);
    }
  };

  // Sort and filter tasks
  const getFilteredAndSortedTasks = () => {
    if (!tasks) return [];

    let filteredTasks = [...tasks];

    // Apply text filter
    if (filterText) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(filterText.toLowerCase()) ||
          task.id.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    // Apply priority filter
    if (priorityFilter !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priorityFilter
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredTasks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredTasks;
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilterText("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setSortConfig({ key: null, direction: "asc" });
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Error Loading Tasks
          </h3>
          <p className="mt-1 text-gray-500">
            {error.response?.data?.message || "Failed to load tasks"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="secondary"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="p-4 space-y-4 flex-none">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Filter tasks..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-[250px] bg-background"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Status: {statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Open")}>
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("InProgress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Blocked")}>
                  Blocked
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Priority: {priorityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriorityFilter("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("Low")}>
                  Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("Medium")}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("High")}>
                  High
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {(filterText ||
              statusFilter !== "All" ||
              priorityFilter !== "All") && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            )}
          </div>
          <Button variant="secondary">View</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : tasks?.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No Tasks Found
            </h3>
            <p className="mt-1 text-gray-500">
              {filterText || statusFilter !== "All" || priorityFilter !== "All"
                ? "Try adjusting your filters"
                : "You don't have any tasks assigned yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[100px]">Task</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Title{" "}
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="w-[150px] cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="w-[150px] cursor-pointer"
                  onClick={() => handleSort("priority")}
                >
                  Priority{" "}
                  {sortConfig.key === "priority" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredAndSortedTasks().map((task) => (
                <TableRow key={task._id || task.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-sm">
                        {task.type}
                      </Badge>
                      <span className="truncate">{task.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {statusIcons[task.status]}
                      <span>{task.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {priorityIcons[task.priority]}
                      <span>{task.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isIntern && (
                          <DropdownMenuItem
                            onClick={() => handleEditClick(task)}
                          >
                            Edit Status
                          </DropdownMenuItem>
                        )}
                        {data.user.role === "Manager" && (
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedTask && (
        <EditTaskDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}
    </div>
  );
}

export default Task;
