import java.util.LinkedList;
import java.util.Queue;

public class WaitingQueue {
    Queue<Vehicle> queue = new LinkedList<>();

    public void addVehicle(Vehicle v) {
        queue.add(v);
    }

    public Vehicle removeVehicle() {
        return queue.poll();
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
