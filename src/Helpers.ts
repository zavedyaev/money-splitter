export class Helpers {
    public static round(toRound: number): number {
        return parseFloat(toRound.toFixed(2));
    }

    public static positive(number: number): boolean {
        return number > 0 && !this.zero(number);
    }

    public static negative(number: number): boolean {
        return number < 0 && !this.zero(number);
    }

    public static zero(number: number): boolean {
        return Math.abs(number) < 0.000001
    }
}