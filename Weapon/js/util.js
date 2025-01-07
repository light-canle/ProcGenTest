class RandomUtil {
    static NextDouble(a, b)
    {
        return a + Math.random() * (b - a);
    }

    static NextInt(max)
    {
        return Math.floor(Math.random() * max);
    }

    static NextInt(a, b)
    {
        return Math.floor(a + Math.random() * (b - a));
    }

    static Choice(array)
    {
        const size = array.length;
        return array[this.NextInt(size)];
    }
}