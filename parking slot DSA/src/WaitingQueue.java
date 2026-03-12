import java.util.LinkedList;
import java.util.Queue;

public class WaitingQueue {
    // CO 3 Stacks And Queues: Queue ADT, Operations
    // CO 2 Lists: Linked list implementation, singly linked lists (used as base for Queues)
    // CO 3 Stacks And Queues: Implementing stacks and queues using Linked List.
    Queue<Vehicle> queue = new LinkedList<>();

    public void addVehicle(Vehicle v) {
        queue.add(v); // CO3: Queue Enqueue Operation
    }

    public Vehicle removeVehicle() {
        return queue.poll(); // CO3: Queue Dequeue Operation
    }

    public void displayQueue() {
        if(queue.isEmpty()) {
            System.out.println("No vehicles waiting");
            return;
        }

        for(Vehicle v : queue) {
            System.out.println(v);
        }
    }
}
