def count_solutions(LENGTH, VALUE, lower_constraints, upper_constraints): #function signature shows all the arguments
    remaining_value = VALUE - sum(lower_constraints)# First apply lower constraints by reducing the problem
    if remaining_value < 0: #If after subtracting all minimum values and we get negative there will be no solution that exists
        return 0
 # this is creating the base stars and bars function
    def stars_and_bars(n, k): #n is the total value to be parititoned, and k is the number of variables
        if n < 0 or k <= 0:  # Handle invalid cases
            return 0 
        numerator = 1 
        denominator = 1 
        for i in range(k-1):
            numerator *= (n + k - 1 - i)
            denominator *= (i + 1)
        return numerator // denominator
    # The formula is C(n+k-1, k-1) where C is combination
    # Just finds the base solution with LENGTh and remaining values
    base_solution = stars_and_bars(remaining_value, LENGTH
    if not upper_constraints: #if upper_constraints are empty no further change is needed
        return base_solution 
    # Apply PIE based on number of upper constraints
    result = base_solution 
    num_constraints = len(upper_constraints) # checks for the number of constraints
    # Single constraint case is handled in the double constraint loop
    if num_constraints >= 2: # checks the adjustev value, if it leads to excess, then it subtracts the invalid solutions from total count
        for i in range(num_constraints):
            idx1, val1 = upper_constraints[i]
            # Subtract solutions that violate this constraint
            adjusted_val1 = val1 - lower_constraints[idx1] + 1
            excess1 = remaining_value - (adjusted_val1)
            if excess1 >= 0:
                result -= stars_and_bars(excess1, LENGTH)
            # Handle pairs
            for j in range(i + 1, num_constraints):
                idx2, val2 = upper_constraints[j]
                # Add back solutions that violate both constraints
                adjusted_val2 = val2 - lower_constraints[idx2] + 1
                excess2 = remaining_value - (adjusted_val1 + adjusted_val2)
                if excess2 >= 0:
                    result += stars_and_bars(excess2, LENGTH)
    # Handle triple constraint case
    if num_constraints == 3:
        idx1, val1 = upper_constraints[0]
        idx2, val2 = upper_constraints[1]
        idx3, val3 = upper_constraints[2]
        adjusted_val1 = val1 - lower_constraints[idx1] + 1
        adjusted_val2 = val2 - lower_constraints[idx2] + 1
        adjusted_val3 = val3 - lower_constraints[idx3] + 1
        excess = remaining_value - (adjusted_val1 + adjusted_val2 + adjusted_val3)
        if excess >= 0:
            result -= stars_and_bars(excess, LENGTH)
    return max(0, result)  # Ensure non-negative result