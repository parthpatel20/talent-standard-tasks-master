using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Talent.Common.Models
{
    public class FeedIncrementModel
    {
        [FromQuery(Name = "position")]
        public int Position { get; set; }
        [FromQuery(Name = "number")]
        public int Number { get; set; }
    }
}
