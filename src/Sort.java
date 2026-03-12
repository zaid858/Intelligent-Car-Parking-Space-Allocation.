public class Sort {
    public static void bubbleSort(Vehicle[] arr, int n) {
        for(int i = 0; i < n - 1; i++) {
            for(int j = 0; j < n - i - 1; j++) {
                if(arr[j].number.compareTo(arr[j + 1].number) > 0) {
                    Vehicle temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}
