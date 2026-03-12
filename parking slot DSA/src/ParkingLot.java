import java.util.Stack;

public class ParkingLot {
    Vehicle[] slots;
    int capacity;
    int count;
    // CO 3 Stacks And Queues: Stack ADT, Operations
    // CO 2 Lists: Abstract Data Types (ADTs), List ADT, Linked list implementation (used as base for Stacks)
    Stack<Vehicle> history = new Stack<>();

    public ParkingLot(int capacity) {
        this.capacity = capacity;
        slots = new Vehicle[capacity];
        count = 0;
    }

    public void parkVehicle(String number, String owner) {
        if(count == capacity) {
            System.out.println("Parking Full");
            return;
        }

        Vehicle v = new Vehicle(number, owner);
        slots[count] = v;
        history.push(v); // CO3: Stack Push Operation
        count++;

        System.out.println("Vehicle Parked Successfully");
    }

    public void removeVehicle(String number) {
        for(int i = 0; i < count; i++) {
            if(slots[i].number.equals(number)) {
                for(int j = i; j < count - 1; j++) {
                    slots[j] = slots[j + 1];
                }

                count--;
                System.out.println("Vehicle Removed");
                return;
            }
        }

        System.out.println("Vehicle Not Found");
    }

    // CO 1 Searching and Sorting: Searching – Linear Search analysis
    public void searchVehicle(String number) {
        for(int i = 0; i < count; i++) {
            if(slots[i].number.equals(number)) {
                System.out.println("Vehicle found at slot " + (i + 1));
                return;
            }
        }

        System.out.println("Vehicle not found");
    }

    public void display() {
        if(count == 0) {
            System.out.println("Parking Empty");
            return;
        }

        for(int i = 0; i < count; i++) {
            System.out.println("Slot " + (i + 1) + " -> " + slots[i]);
        }
    }

    public void sortVehicles() {
        // CO 1 Searching and Sorting: Bubble sort
        Sort.bubbleSort(slots, count);
        System.out.println("Vehicles Sorted");
    }

    // CO 3 Stacks And Queues: Stack ADT, Operations
    public void undoLastPark() {
        if(history.isEmpty()) {
            System.out.println("No history");
            return;
        }

        Vehicle v = history.pop(); // CO3: Stack Pop Operation
        removeVehicle(v.number);
        System.out.println("Undo Successful");
    }
}
