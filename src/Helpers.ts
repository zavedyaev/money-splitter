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

    public static getQueryVariable(variable: string) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i=0; i<vars.length; i++) {
            let pair = vars[i].split("=");
            if(pair[0] === variable){return pair[1];}
        }
        return false;
    }
}