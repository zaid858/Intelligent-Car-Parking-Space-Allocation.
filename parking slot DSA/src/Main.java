import java.util.Scanner;

// CO 2 Lists: Applications of lists (Program implements an overarching application of various Abstract Data Types)
public class Main {
    
    public static boolean isValidVehicleNumber(String num) {
        return num.matches("[A-Z]{2} \\d{2} [A-Z]{2} \\d{4}");
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // CO 2 Lists: Abstract Data Types (ADTs)
        ParkingLot lot = new ParkingLot(5);
        WaitingQueue queue = new WaitingQueue();

        int choice;

        while(true) {
            System.out.println("\n--- Parking Slot Management ---");
            System.out.println("1 Park Vehicle");
            System.out.println("2 Remove Vehicle");
            System.out.println("3 Display Parking");
            System.out.println("4 Search Vehicle");
            System.out.println("5 Sort Vehicles");
            System.out.println("6 Undo Last Park");
            System.out.println("7 Exit");

            System.out.print("Enter Choice: ");
            try {
                choice = sc.nextInt();
            } catch (java.util.InputMismatchException e) {
                System.out.println("Invalid input! Please enter a number between 1-7.");
                sc.nextLine();
                continue;
            }

            switch(choice) {
                case 1:
                    sc.nextLine();
                    System.out.print("Vehicle Number (format: AB XX CD XXXX): ");
                    String num = sc.nextLine().trim();
                    
                    if(!isValidVehicleNumber(num)) {
                        System.out.println("Invalid format! Use: AB XX CD XXXX");
                        break;
                    }
                    
                    System.out.print("Owner Name: ");
                    String owner = sc.nextLine().trim();
                    lot.parkVehicle(num, owner);
                    break;

                case 2:
                    sc.nextLine();
                    System.out.print("Vehicle Number (format: AB XX CD XXXX): ");
                    num = sc.nextLine().trim();
                    
                    if(!isValidVehicleNumber(num)) {
                        System.out.println("Invalid format! Use: AB XX CD XXXX");
                        break;
                    }
                    
                    lot.removeVehicle(num);
                    break;

                case 3:
                    lot.display();
                    break;

                case 4:
                    sc.nextLine();
                    System.out.print("Vehicle Number (format: AB XX CD XXXX): ");
                    num = sc.nextLine().trim();
                    
                    if(!isValidVehicleNumber(num)) {
                        System.out.println("Invalid format! Use: AB XX CD XXXX");
                        break;
                    }
                    
                    lot.searchVehicle(num);
                    break;

                case 5:
                    lot.sortVehicles();
                    break;

                case 6:
                    lot.undoLastPark();
                    break;

                case 7:
                    System.exit(0);
                    break;

                default:
                    System.out.println("Invalid choice");
            }
        }
    }
}
