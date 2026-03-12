import java.util.Stack;

public class ParkingLot {
    Vehicle[] slots;
    int capacity;
    int count;
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
        history.push(v);
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
        Sort.bubbleSort(slots, count);
        System.out.println("Vehicles Sorted");
    }

    public void undoLastPark() {
        if(history.isEmpty()) {
            System.out.println("No history");
            return;
        }

        Vehicle v = history.pop();
        removeVehicle(v.number);
        System.out.println("Undo Successful");
    }
}
