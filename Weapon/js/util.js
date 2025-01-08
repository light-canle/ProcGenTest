class RandomUtil {
    static NextDouble(a, b)
    {
        return a + Math.random() * (b - a);
    }

    static NextInt(a, b)
    {
        return Math.floor(a + Math.random() * (b - a));
    }

    static Choice(array)
    {
        const size = array.length;
        const index = RandomUtil.NextInt(0, size);
        return array[index];
    }
}