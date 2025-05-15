namespace HMS.Models
{
    public class MonthlyMeds
    {
        public string Month { get; set; }
        public int ValidatedMedsCount { get; set; }
        public int MissingMedsCount { get; set; }
        public string TopValidatedCategory { get; set; }
        public string TopMissingCategory { get; set; }
    }

}
