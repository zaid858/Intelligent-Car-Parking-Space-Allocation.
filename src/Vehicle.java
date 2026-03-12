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
