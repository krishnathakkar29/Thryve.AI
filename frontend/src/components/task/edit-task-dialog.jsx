import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/App";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function EditTaskDialog({ isOpen, onClose, task }) {
  console.log(task);
  const [status, setStatus] = useState(task.status);
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, newStatus }) => {
      console.log(newStatus);
      console.log(taskId);
      const response = await api.put(`/api/task/${taskId}/status`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchInternTasks"] });
      toast.success("Task status updated successfully");
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
    },
  });

  const handleUpdateStatus = () => {
    updateTaskMutation.mutate({ taskId: task._id, newStatus: status });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task Status</DialogTitle>
          <DialogDescription>
            Update the status for task: {task.title}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Status
            </label>
            <Select
              value={status}
              onValueChange={setStatus}
              disabled={updateTaskMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            disabled={updateTaskMutation.isPending}
          >
            {updateTaskMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
