// CO 2 Lists: Abstract Data Types (ADTs) - Custom object structure to hold related attributes securely
public class Vehicle {
    String number;
    String owner;

    public Vehicle(String number, String owner) {
        this.number = number;
        this.owner = owner;
    }

    public String toString() {
        return number + " (Owner: " + owner + ")";
    }
}
